import { Request, Response } from 'express';
import prisma from '../config/db';

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.systemSettings.findUnique({ where: { id: 'default' } });
    if (!settings) {
      settings = await prisma.systemSettings.create({ data: { id: 'default' } });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { universityName, aiProvider, allocationRules, theme } = req.body;
    const settings = await prisma.systemSettings.upsert({
      where: { id: 'default' },
      update: { universityName, aiProvider, allocationRules, theme },
      create: { id: 'default', universityName, aiProvider, allocationRules, theme }
    });
    res.status(200).json({ success: true, data: settings, message: 'Settings updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
