import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from backend/.env regardless of starting working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai.routes';
import sessionRoutes from './routes/session.routes';
import { initDb, pool } from './db';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - allow Vite frontend at localhost:5173
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile, curl, server-to-server) or listed origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Health endpoint
app.get('/api/health', async (_req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  try {
    const dbRes = await pool.query('SELECT 1 as alive');
    if (dbRes.rows?.[0]?.alive === 1) {
      dbStatus = 'connected';
    }
  } catch (err: any) {
    dbStatus = `error: ${err?.message || 'failed'}`;
  }

  res.json({
    status: 'ok',
    message: 'APTIVUE AI Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus
  });
});

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/sessions', sessionRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Initialize database schema and start server
async function startServer() {
  try {
    await initDb();
  } catch (err) {
    console.error('Warning: Database initialization encountered an error:', err);
  }

  app.listen(PORT, () => {
    console.log(`🚀 APTIVUE AI Backend running on http://localhost:${PORT}`);
    console.log(`📍 Health endpoint: http://localhost:${PORT}/api/health`);
    console.log(`🤖 AI Question endpoint: http://localhost:${PORT}/api/ai/generate-questions`);
    console.log(`💾 Sessions endpoint: http://localhost:${PORT}/api/sessions`);
  });
}

startServer();

export default app;
