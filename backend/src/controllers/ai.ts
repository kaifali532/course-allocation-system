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
    await prisma.aiQueryHistory.create({
      data: { query, response }
    });

    res.status(200).json({ success: true, response });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
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
