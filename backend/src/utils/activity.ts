import prisma from '../config/db';

export const logActivity = async (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' = 'INFO') => {
  try {
    await prisma.recentActivity.create({
      data: {
        title,
        message,
        type
      }
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
