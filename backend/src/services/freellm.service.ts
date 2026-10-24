export interface Question {
  id: number;
  prompt: string;
  hint: string;
}

export interface EvaluateItem {
  questionId: number;
  prompt: string;
  hint?: string;
  answerText: string;
}

export interface EvaluateSessionOptions {
  jobRole: string;
  type: string;
  difficulty: string;
  items: EvaluateItem[];
}

export interface QuestionEvaluation {
  questionId: number;
  score: number;
  feedback: string;
}

export interface EvaluationResult {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  structureScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  questionEvaluations: QuestionEvaluation[];
}

export interface GenerateQuestionsOptions {
  type: 'Technical' | 'Behavioral' | 'Mixed';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  length: number;
  jobRole?: string;
  targetJob?: string | {
    title?: string;
    company?: string;
    description?: string;
  };
}

export class FreeLLMService {
  private getApiKey(): string {
    const key = process.env.FREELLMAPI_API_KEY?.trim();
    if (!key) {
      throw new Error('FREELLMAPI_API_KEY is not configured in backend environment.');
    }
    return key;
  }

  private getBaseUrl(): string {
    let baseUrl = (process.env.FREELLMAPI_BASE_URL || 'http://127.0.0.1:3001/v1').trim();
    // On Windows/dual-stack setups, normalize localhost:3001 to 127.0.0.1:3001
    // to ensure traffic reaches the FreeLLMAPI container on IPv4 rather than looping back to Express on [::1]
    baseUrl = baseUrl.replace('://localhost:3001', '://127.0.0.1:3001');
    baseUrl = baseUrl.replace(/\/+$/, '');
    return baseUrl;
  }

  private getModel(): string {
    return (process.env.FREELLMAPI_MODEL || 'auto').trim();
  }

  private resolveEndpoint(): string {
    const base = this.getBaseUrl();
    if (base.endsWith('/chat/completions')) {
      return base;
    }
    if (base.endsWith('/v1')) {
      return `${base}/chat/completions`;
    }
    return `${base}/v1/chat/completions`;
  }

  /**
   * Generates interview questions tailored to the candidate's target job role,
   * difficulty, and interview type.
   */
  async generateQuestions(options: GenerateQuestionsOptions): Promise<Question[]> {
    const apiKey = this.getApiKey();
    const model = this.getModel();
    const endpoint = this.resolveEndpoint();

    const {
      type = 'Technical',
      difficulty = 'Intermediate',
      length = 5,
      jobRole,
      targetJob
    } = options;

    let roleContext = jobRole || 'Full Stack Software Engineer';
    if (targetJob) {
      if (typeof targetJob === 'string' && targetJob.trim().length > 0) {
        roleContext = targetJob.trim();
      } else if (typeof targetJob === 'object' && targetJob.title) {
        roleContext = `${targetJob.title}${targetJob.company ? ` at ${targetJob.company}` : ''}`;
        if (targetJob.description) {
          roleContext += ` (Job Description: ${targetJob.description.slice(0, 300)})`;
        }
      }
    }

    const systemPrompt = `You are an expert AI interviewer for APTIVUE AI, an interview preparation platform.
Your task is to generate realistic, high-quality interview questions tailored for a candidate.

Output Format Requirements:
- You must respond ONLY with a raw, valid JSON array.
- Do NOT wrap the JSON in Markdown backticks (do not use \`\`\`json or \`\`\`).
- Do NOT include any introductory or concluding text.
- Each item in the array must be an object with exact keys:
  - "id": integer starting from 1
  - "prompt": string containing the interview question
  - "hint": string containing a concise hint highlighting key concepts or aspects the candidate should address

Schema Example:
[
  {
    "id": 1,
    "prompt": "Explain how React 19 handles concurrent rendering under heavy CPU load.",
    "hint": "Mention time slicing, non-blocking rendering, and selective hydration."
  }
]`;

    const userPrompt = `Generate exactly ${length} ${type} interview questions for a ${roleContext} role at a ${difficulty} difficulty level.
Ensure the questions are modern, relevant, and test deep understanding appropriate for ${difficulty} level.
Return only the JSON array with ${length} questions.`;

    const requestPayload = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2048
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

    let rawResponse: Response;
    try {
      rawResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });
    } catch (err: unknown) {
      clearTimeout(timeout);
      const isAbort = (err as Error)?.name === 'AbortError';
      const message = isAbort
        ? 'FreeLLMAPI request timed out after 60 seconds.'
        : `Network error connecting to FreeLLMAPI at ${this.getBaseUrl()}: ${(err as Error)?.message || 'Unknown network error'}`;
      throw new Error(message);
    } finally {
      clearTimeout(timeout);
    }

    if (!rawResponse.ok) {
      let errorBody = '';
      try {
        errorBody = await rawResponse.text();
      } catch {
        errorBody = 'Unable to read error response body';
      }
      throw new Error(`FreeLLMAPI upstream error (HTTP ${rawResponse.status}): ${errorBody}`);
    }

    let data: any;
    try {
      data = await rawResponse.json();
    } catch (parseErr) {
      throw new Error('Failed to parse response JSON from FreeLLMAPI.');
    }

    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error('FreeLLMAPI returned empty or invalid choices content.');
    }

    return this.parseAndValidateQuestions(content, length);
  }

  /**
   * Sanitizes and parses LLM text content into validated Question objects.
   */
  private parseAndValidateQuestions(content: string, expectedCount: number): Question[] {
    let cleanText = content.trim();

    // Strip markdown code fences if present
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleanText);
    } catch {
      // If parsing failed, try finding array bounds [ ... ]
      const startIdx = cleanText.indexOf('[');
      const endIdx = cleanText.lastIndexOf(']');
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        try {
          parsed = JSON.parse(cleanText.substring(startIdx, endIdx + 1));
        } catch (innerErr) {
          throw new Error('Failed to parse generated questions as JSON array from LLM response.');
        }
      } else {
        throw new Error('LLM response did not contain a valid JSON array.');
      }
    }

    let list: any[] = [];
    if (Array.isArray(parsed)) {
      list = parsed;
    } else if (parsed && Array.isArray(parsed.questions)) {
      list = parsed.questions;
    } else {
      throw new Error('Generated output is not a list of questions.');
    }

    if (list.length === 0) {
      throw new Error('Generated questions list is empty.');
    }

    const questions: Question[] = list.map((item, index) => {
      const prompt = typeof item.prompt === 'string' && item.prompt.trim()
        ? item.prompt.trim()
        : (typeof item.question === 'string' && item.question.trim() ? item.question.trim() : `Question ${index + 1}`);

      const hint = typeof item.hint === 'string' && item.hint.trim()
        ? item.hint.trim()
        : 'Think through core principles and practical architectural trade-offs.';

      return {
        id: index + 1,
        prompt,
        hint
      };
    });

    return questions.slice(0, expectedCount || questions.length);
  }

  /**
   * Evaluates a candidate's completed interview session against questions, hints, and job role.
   */
  async evaluateSession(options: EvaluateSessionOptions): Promise<EvaluationResult> {
    const apiKey = this.getApiKey();
    const model = this.getModel();
    const endpoint = this.resolveEndpoint();

    const { jobRole, type, difficulty, items } = options;

    const answeredItems = items.filter(it => it.answerText && it.answerText.trim().length > 0);

    if (answeredItems.length === 0) {
      return {
        overallScore: 0,
        communicationScore: 0,
        technicalScore: 0,
        structureScore: 0,
        summary: 'No answers were submitted for this interview session.',
        strengths: ['Interview initiated.'],
        weaknesses: ['No answers were provided for evaluation.'],
        suggestions: ['Complete the questions to receive meaningful feedback.'],
        questionEvaluations: items.map(q => ({
          questionId: q.questionId,
          score: 0,
          feedback: 'Question skipped or left blank.'
        }))
      };
    }

    const itemsFormatted = items.map((it, idx) => `
Question ${idx + 1} (ID: ${it.questionId}):
Prompt: ${it.prompt}
Hint: ${it.hint || 'None provided'}
Candidate Answer: ${it.answerText?.trim() || '[NO ANSWER GIVEN]'}
`).join('\n---\n');

    const systemPrompt = `You are a rigorous, highly experienced engineering hiring manager and AI technical interviewer for APTIVUE AI.
Your task is to thoroughly evaluate a candidate's interview responses for a "${jobRole}" role (${type} interview, ${difficulty} level).

Evaluation Guidelines:
1. Score fairly from 0 to 100 based on technical depth, accuracy, relevance to the prompt/hint, and communication quality.
2. Provide constructive, specific feedback referencing concepts mentioned or missed.
3. Sub-scores (0-100):
   - communicationScore: clarity, conciseness, and articulation.
   - technicalScore: conceptual correctness, engineering trade-offs, and depth.
   - structureScore: logical flow, problem-solving framework (e.g. STAR method or systematic breakdown).
4. Output Format Requirements:
   - You MUST reply ONLY with a raw, valid JSON object matching the schema below.
   - Do NOT wrap the JSON in Markdown code fences.
   - Do NOT include any conversational preamble or outro.

Exact JSON Schema:
{
  "overallScore": 84,
  "communicationScore": 88,
  "technicalScore": 82,
  "structureScore": 85,
  "summary": "Demonstrated solid technical understanding with structured problem-solving approaches.",
  "strengths": [
    "Clear breakdown of architectural trade-offs.",
    "Effective explanation of edge-case handling."
  ],
  "weaknesses": [
    "Could provide more concrete metrics regarding performance impacts.",
    "Could elaborate further on distributed consistency guarantees."
  ],
  "suggestions": [
    "Quantify scaling limits and memory footprint in system design answers.",
    "Reference specific monitoring and observability tooling."
  ],
  "questionEvaluations": [
    {
      "questionId": 1,
      "score": 85,
      "feedback": "Strong answer covering the core principles."
    }
  ]
}`;

    const userPrompt = `Evaluate the following interview responses for a ${jobRole} candidate:

${itemsFormatted}

Return ONLY the raw JSON object.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    let rawResponse: Response;
    try {
      rawResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 3000
        }),
        signal: controller.signal
      });
    } catch (err: unknown) {
      clearTimeout(timeout);
      const isAbort = (err as Error)?.name === 'AbortError';
      throw new Error(isAbort ? 'Evaluation timed out after 60s' : `Network error: ${(err as Error)?.message}`);
    } finally {
      clearTimeout(timeout);
    }

    if (!rawResponse.ok) {
      const errText = await rawResponse.text().catch(() => '');
      throw new Error(`FreeLLMAPI evaluation failed (HTTP ${rawResponse.status}): ${errText}`);
    }

    const data: any = await rawResponse.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error('FreeLLMAPI returned empty evaluation response.');
    }

    return this.parseEvaluation(content, items);
  }

  private parseEvaluation(content: string, items: EvaluateItem[]): EvaluationResult {
    let clean = content.trim();
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    }

    let parsed: any;
    try {
      parsed = JSON.parse(clean);
    } catch {
      const start = clean.indexOf('{');
      const end = clean.lastIndexOf('}');
      if (start !== -1 && end > start) {
        parsed = JSON.parse(clean.substring(start, end + 1));
      } else {
        throw new Error('Could not parse AI evaluation response as JSON.');
      }
    }

    const clamp = (val: any, fallback = 75) => {
      const n = typeof val === 'number' ? val : parseFloat(val);
      return !isNaN(n) ? Math.min(100, Math.max(0, Math.round(n))) : fallback;
    };

    const overallScore = clamp(parsed.overallScore, 75);
    const communicationScore = clamp(parsed.communicationScore, overallScore);
    const technicalScore = clamp(parsed.technicalScore, overallScore);
    const structureScore = clamp(parsed.structureScore, overallScore);

    const summary = typeof parsed.summary === 'string' && parsed.summary.trim()
      ? parsed.summary.trim()
      : 'Comprehensive evaluation of candidate technical and behavioral performance.';

    const strengths = Array.isArray(parsed.strengths) && parsed.strengths.length > 0
      ? parsed.strengths.map(String)
      : ['Solid fundamental comprehension of technical principles.', 'Structured communication format.'];

    const weaknesses = Array.isArray(parsed.weaknesses) && parsed.weaknesses.length > 0
      ? parsed.weaknesses.map(String)
      : ['Could dive deeper into specific architectural trade-offs.', 'Expand on production error handling strategies.'];

    const suggestions = Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0
      ? parsed.suggestions.map(String)
      : ['Incorporate more concrete metrics and real-world scale numbers.', 'Structure answers using a clear problem-action-result sequence.'];

    const questionEvaluations: QuestionEvaluation[] = items.map((q) => {
      const match = Array.isArray(parsed.questionEvaluations)
        ? parsed.questionEvaluations.find((e: any) => e.questionId === q.questionId)
        : null;

      return {
        questionId: q.questionId,
        score: match ? clamp(match.score, overallScore) : (q.answerText?.trim() ? overallScore : 0),
        feedback: match?.feedback || (q.answerText?.trim() ? 'Good baseline response addressing core question points.' : 'No response provided.')
      };
    });

    return {
      overallScore,
      communicationScore,
      technicalScore,
      structureScore,
      summary,
      strengths,
      weaknesses,
      suggestions,
      questionEvaluations
    };
  }
}

export const freeLLMService = new FreeLLMService();
