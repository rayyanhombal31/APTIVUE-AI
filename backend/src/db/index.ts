import { Pool } from 'pg';

let dbUrl = process.env.DATABASE_URL || '';
dbUrl = dbUrl.replace(/^['"]|['"]$/g, '').trim();

export const pool = new Pool({
  connectionString: dbUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

/**
 * Initializes required tables in PostgreSQL if they do not already exist.
 */
export async function initDb(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Interview sessions
    await client.query(`
      CREATE TABLE IF NOT EXISTS interview_sessions (
        id SERIAL PRIMARY KEY,
        job_role VARCHAR(255) NOT NULL,
        interview_type VARCHAR(50) NOT NULL,
        difficulty VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'created',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Interview questions
    await client.query(`
      CREATE TABLE IF NOT EXISTS interview_questions (
        id SERIAL PRIMARY KEY,
        session_id INTEGER NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
        prompt TEXT NOT NULL,
        hint TEXT,
        question_order INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Interview answers
    await client.query(`
      CREATE TABLE IF NOT EXISTS interview_answers (
        id SERIAL PRIMARY KEY,
        question_id INTEGER NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE,
        answer_text TEXT NOT NULL,
        score NUMERIC(5, 2),
        feedback TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'uq_interview_answers_question_id'
        ) THEN
          ALTER TABLE interview_answers ADD CONSTRAINT uq_interview_answers_question_id UNIQUE (question_id);
        END IF;
      END $$;
    `);

    // 4. Interview evaluations
    await client.query(`
      CREATE TABLE IF NOT EXISTS interview_evaluations (
        id SERIAL PRIMARY KEY,
        session_id INTEGER NOT NULL UNIQUE REFERENCES interview_sessions(id) ON DELETE CASCADE,
        overall_score NUMERIC(5, 2) NOT NULL,
        communication_score NUMERIC(5, 2),
        technical_score NUMERIC(5, 2),
        structure_score NUMERIC(5, 2),
        strengths JSONB NOT NULL DEFAULT '[]',
        weaknesses JSONB NOT NULL DEFAULT '[]',
        suggestions JSONB NOT NULL DEFAULT '[]',
        summary TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('COMMIT');
    console.log('✅ PostgreSQL database tables verified/initialized.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to initialize database schema:', error);
    throw error;
  } finally {
    client.release();
  }
}
