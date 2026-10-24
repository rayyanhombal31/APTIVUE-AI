import { Router, Request, Response } from 'express';
import { freeLLMService, GenerateQuestionsOptions } from '../services/freellm.service';

const router = Router();

/**
 * POST /api/ai/generate-questions
 * Generates dynamic interview questions using the FreeLLMAPI Unified API.
 */
router.post('/generate-questions', async (req: Request, res: Response) => {
  try {
    const { type, difficulty, length, jobRole, targetJob } = req.body || {};

    // Validate type
    const validTypes = ['Technical', 'Behavioral', 'Mixed'] as const;
    const resolvedType = validTypes.includes(type) ? type : 'Technical';

    // Validate difficulty
    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'] as const;
    const resolvedDifficulty = validDifficulties.includes(difficulty) ? difficulty : 'Intermediate';

    // Validate length
    const parsedLength = typeof length === 'number' ? length : parseInt(String(length), 10);
    const resolvedLength = !isNaN(parsedLength) && parsedLength > 0 && parsedLength <= 20
      ? parsedLength
      : 5;

    const options: GenerateQuestionsOptions = {
      type: resolvedType,
      difficulty: resolvedDifficulty,
      length: resolvedLength,
      jobRole: typeof jobRole === 'string' ? jobRole.trim() : undefined,
      targetJob
    };

    const questions = await freeLLMService.generateQuestions(options);

    res.json({
      success: true,
      questions,
      count: questions.length
    });
  } catch (error: any) {
    console.error('Error generating questions:', error.message || error);
    
    // Distinguish between configuration/validation errors and upstream network errors
    const errorMessage = error?.message || 'Failed to generate interview questions';
    const isConfigError = errorMessage.includes('FREELLMAPI_API_KEY is not configured');
    const isUpstreamError = errorMessage.includes('FreeLLMAPI upstream error') || errorMessage.includes('Network error');

    const statusCode = isConfigError ? 500 : (isUpstreamError ? 502 : 500);

    res.status(statusCode).json({
      success: false,
      error: errorMessage
    });
  }
});

export default router;
