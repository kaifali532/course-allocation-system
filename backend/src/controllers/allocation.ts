import { Request, Response } from 'express';
import { runAllocationLogic, resetAllocationLogic } from '../services/allocationService';
import prisma from '../config/db';

export const runAllocation = async (req: Request, res: Response) => {
  try {
    const result = await runAllocationLogic();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetAllocation = async (req: Request, res: Response) => {
  try {
    const result = await resetAllocationLogic();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllocations = async (req: Request, res: Response) => {
  try {
    const allocations = await prisma.allocation.findMany({
      include: {
        student: true,
        course: true
      },
      orderBy: { allocationDate: 'desc' }
    });
    res.status(200).json({ success: true, data: allocations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
