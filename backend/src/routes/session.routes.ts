import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { freeLLMService } from '../services/freellm.service';

const router = Router();

/**
 * POST /api/sessions
 * Saves a new interview session and its questions.
 */
router.post('/', async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const {
      jobRole = 'Software Engineer',
      type = 'Technical',
      difficulty = 'Intermediate',
      status = 'created',
      questions = []
    } = req.body || {};

    await client.query('BEGIN');

    // 1. Insert session
    const sessionRes = await client.query(
      `INSERT INTO interview_sessions (job_role, interview_type, difficulty, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, job_role, interview_type, difficulty, status, created_at`,
      [jobRole, type, difficulty, status]
    );
    const session = sessionRes.rows[0];

    // 2. Insert questions if provided
    const insertedQuestions: any[] = [];
    if (Array.isArray(questions) && questions.length > 0) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const prompt = typeof q.prompt === 'string' ? q.prompt : 'Untitled question';
        const hint = typeof q.hint === 'string' ? q.hint : null;
        const order = typeof q.order === 'number' ? q.order : (typeof q.id === 'number' ? q.id : i + 1);

        const qRes = await client.query(
          `INSERT INTO interview_questions (session_id, prompt, hint, question_order)
           VALUES ($1, $2, $3, $4)
           RETURNING id, session_id, prompt, hint, question_order, created_at`,
          [session.id, prompt, hint, order]
        );
        insertedQuestions.push(qRes.rows[0]);
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      session: {
        ...session,
        questions: insertedQuestions
      }
    });
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('Error creating interview session:', err);
    res.status(500).json({ success: false, error: 'Failed to create interview session' });
  } finally {
    client.release();
  }
});

/**
 * GET /api/sessions/:id
 * Retrieves an interview session with all its questions and recorded answers.
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const sessionId = parseInt(rawId, 10);
    if (isNaN(sessionId)) {
      res.status(400).json({ success: false, error: 'Invalid session ID' });
      return;
    }

    const sessionRes = await pool.query(
      `SELECT id, job_role, interview_type, difficulty, status, created_at, updated_at
       FROM interview_sessions
       WHERE id = $1`,
      [sessionId]
    );

    if (sessionRes.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Interview session not found' });
      return;
    }

    const session = sessionRes.rows[0];

    // Fetch questions
    const questionsRes = await pool.query(
      `SELECT id, session_id, prompt, hint, question_order, created_at
       FROM interview_questions
       WHERE session_id = $1
       ORDER BY question_order ASC, id ASC`,
      [sessionId]
    );

    const questions = questionsRes.rows;

    // Fetch answers for these questions
    if (questions.length > 0) {
      const questionIds = questions.map(q => q.id);
      const answersRes = await pool.query(
        `SELECT id, question_id, answer_text, score, feedback, created_at
         FROM interview_answers
         WHERE question_id = ANY($1::int[])
         ORDER BY id ASC`,
        [questionIds]
      );

      const answersByQuestionId = new Map<number, any[]>();
      for (const ans of answersRes.rows) {
        if (!answersByQuestionId.has(ans.question_id)) {
          answersByQuestionId.set(ans.question_id, []);
        }
        answersByQuestionId.get(ans.question_id)!.push(ans);
      }

      for (const q of questions) {
        q.answers = answersByQuestionId.get(q.id) || [];
      }
    }

    // Fetch evaluation if exists
    const evalRes = await pool.query(
      `SELECT id, session_id, overall_score, communication_score, technical_score, structure_score,
              strengths, weaknesses, suggestions, summary, created_at
       FROM interview_evaluations
       WHERE session_id = $1`,
      [sessionId]
    );

    res.json({
      success: true,
      session: {
        ...session,
        questions,
        evaluation: evalRes.rows[0] || null
      }
    });
  } catch (err: any) {
    console.error('Error fetching interview session:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch interview session' });
  }
});

/**
 * POST /api/sessions/:id/answers
 * Saves or updates an interview answer to a question in this session.
 */
router.post('/:id/answers', async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const sessionId = parseInt(rawId, 10);
    const { questionId, answerText, score, feedback } = req.body || {};

    if (isNaN(sessionId) || !questionId || typeof answerText !== 'string') {
      res.status(400).json({ success: false, error: 'Missing required fields: questionId, answerText' });
      return;
    }

    // Verify question belongs to session
    const qCheck = await pool.query(
      `SELECT id FROM interview_questions WHERE id = $1 AND session_id = $2`,
      [questionId, sessionId]
    );

    if (qCheck.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Question not found in this session' });
      return;
    }

    const answerRes = await pool.query(
      `INSERT INTO interview_answers (question_id, answer_text, score, feedback)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (question_id)
       DO UPDATE SET
         answer_text = EXCLUDED.answer_text,
         score = COALESCE(EXCLUDED.score, interview_answers.score),
         feedback = COALESCE(EXCLUDED.feedback, interview_answers.feedback),
         created_at = CURRENT_TIMESTAMP
       RETURNING id, question_id, answer_text, score, feedback, created_at`,
      [questionId, answerText, score ?? null, feedback ?? null]
    );

    res.status(201).json({
      success: true,
      answer: answerRes.rows[0]
    });
  } catch (err: any) {
    console.error('Error saving answer:', err);
    res.status(500).json({ success: false, error: 'Failed to save answer' });
  }
});

/**
 * POST /api/sessions/:id/evaluate
 * Evaluates the entire session's answers using AI, stores the results in PostgreSQL,
 * and updates session status to completed.
 */
router.post('/:id/evaluate', async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const sessionId = parseInt(rawId, 10);
    if (isNaN(sessionId)) {
      res.status(400).json({ success: false, error: 'Invalid session ID' });
      return;
    }

    // 1. Check session existence
    const sessionRes = await client.query(
      `SELECT id, job_role, interview_type, difficulty, status
       FROM interview_sessions
       WHERE id = $1`,
      [sessionId]
    );

    if (sessionRes.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Interview session not found' });
      return;
    }

    const session = sessionRes.rows[0];

    // 2. If answers were passed in body, upsert them first (ensures no answers lost)
    const { answers } = req.body || {};
    if (answers && typeof answers === 'object') {
      for (const [qIdStr, ansText] of Object.entries(answers)) {
        const qId = parseInt(qIdStr, 10);
        if (!isNaN(qId) && typeof ansText === 'string' && ansText.trim().length > 0) {
          await client.query(
            `INSERT INTO interview_answers (question_id, answer_text)
             VALUES ($1, $2)
             ON CONFLICT (question_id)
             DO UPDATE SET answer_text = EXCLUDED.answer_text, created_at = CURRENT_TIMESTAMP`,
            [qId, ansText.trim()]
          );
        }
      }
    }

    // 3. Fetch all questions and their answers
    const questionsRes = await client.query(
      `SELECT q.id, q.prompt, q.hint, q.question_order, a.answer_text
       FROM interview_questions q
       LEFT JOIN interview_answers a ON a.question_id = q.id
       WHERE q.session_id = $1
       ORDER BY q.question_order ASC, q.id ASC`,
      [sessionId]
    );

    const questions = questionsRes.rows;
    if (questions.length === 0) {
      res.status(400).json({ success: false, error: 'Session has no questions to evaluate' });
      return;
    }

    // 4. Call AI evaluation service
    const evaluation = await freeLLMService.evaluateSession({
      jobRole: session.job_role,
      type: session.interview_type,
      difficulty: session.difficulty,
      items: questions.map(q => ({
        questionId: q.id,
        prompt: q.prompt,
        hint: q.hint || undefined,
        answerText: q.answer_text || ''
      }))
    });

    await client.query('BEGIN');

    // 5. Update individual answer scores and feedback
    for (const qEval of evaluation.questionEvaluations) {
      await client.query(
        `UPDATE interview_answers
         SET score = $1, feedback = $2
         WHERE question_id = $3`,
        [qEval.score, qEval.feedback, qEval.questionId]
      );
    }

    // 6. Save or update evaluation in interview_evaluations
    const evalSaveRes = await client.query(
      `INSERT INTO interview_evaluations (
         session_id, overall_score, communication_score, technical_score, structure_score,
         strengths, weaknesses, suggestions, summary
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (session_id)
       DO UPDATE SET
         overall_score = EXCLUDED.overall_score,
         communication_score = EXCLUDED.communication_score,
         technical_score = EXCLUDED.technical_score,
         structure_score = EXCLUDED.structure_score,
         strengths = EXCLUDED.strengths,
         weaknesses = EXCLUDED.weaknesses,
         suggestions = EXCLUDED.suggestions,
         summary = EXCLUDED.summary,
         created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        sessionId,
        evaluation.overallScore,
        evaluation.communicationScore,
        evaluation.technicalScore,
        evaluation.structureScore,
        JSON.stringify(evaluation.strengths),
        JSON.stringify(evaluation.weaknesses),
        JSON.stringify(evaluation.suggestions),
        evaluation.summary
      ]
    );

    // 7. Update session status to completed
    await client.query(
      `UPDATE interview_sessions
       SET status = 'completed', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [sessionId]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      evaluation: evalSaveRes.rows[0]
    });
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('Error during interview evaluation:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to evaluate interview session' });
  } finally {
    client.release();
  }
});

export default router;
