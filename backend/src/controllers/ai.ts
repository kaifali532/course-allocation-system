import { Request, Response } from 'express';
import { getAIProvider } from '../services/aiService';
import prisma from '../config/db';

export const askAI = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ success: false, message: 'Query is required' });

    const aiProvider = getAIProvider();
    const response = await aiProvider.askQuestion(query);

    // Store history
    try {
      await prisma.aiQueryHistory.create({
        data: { query, response }
      });
    } catch (dbErr) {
      console.warn('[AI] Could not save to history:', dbErr);
    }

    res.status(200).json({ success: true, response });
  } catch (error: any) {
    console.error('[AI Controller] Error:', error.message);
    
    // Map error types to appropriate HTTP status codes
    let statusCode = 500;
    if (error.message?.startsWith('MISSING_API_KEY')) statusCode = 503;
    else if (error.message?.startsWith('INVALID_API_KEY')) statusCode = 401;
    else if (error.message?.startsWith('PERMISSION_DENIED')) statusCode = 403;
    else if (error.message?.startsWith('MODEL_NOT_FOUND')) statusCode = 404;
    else if (error.message?.startsWith('RATE_LIMITED')) statusCode = 429;
    
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const history = await prisma.aiQueryHistory.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearHistory = async (req: Request, res: Response) => {
  try {
    await prisma.aiQueryHistory.deleteMany();
    res.status(200).json({ success: true, message: 'Chat history cleared' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
