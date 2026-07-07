import { Request, Response } from 'express';
import { runAllocationLogic, resetAllocationLogic } from '../services/allocationService';
import prisma from '../config/db';
import { logActivity } from '../utils/activity';

export const runAllocation = async (req: Request, res: Response) => {
  try {
    const result = await runAllocationLogic();
    await logActivity('Allocation Run', 'Allocation engine executed successfully.', 'SUCCESS');
    res.status(200).json(result);
  } catch (error: any) {
    await logActivity('Allocation Run', `Failed: ${error.message}`, 'ERROR');
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetAllocation = async (req: Request, res: Response) => {
  try {
    const result = await resetAllocationLogic();
    await logActivity('Allocation Reset', 'Allocation data reset successfully.', 'SUCCESS');
    res.status(200).json(result);
  } catch (error: any) {
    await logActivity('Allocation Reset', `Failed: ${error.message}`, 'ERROR');
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
