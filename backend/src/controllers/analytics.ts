import { Request, Response } from 'express';
import prisma from '../config/db';

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalStudents = await prisma.student.count();
    const totalCourses = await prisma.course.count();
    const allocations = await prisma.allocation.count();
    
    // Department breakdown
    const courses = await prisma.course.findMany();
    const departmentStats: Record<string, { seats: number, courses: number }> = {};
    let totalSeats = 0;
    
    for (const c of courses) {
      if (!departmentStats[c.department]) {
        departmentStats[c.department] = { seats: 0, courses: 0 };
      }
      departmentStats[c.department].seats += c.totalSeats;
      departmentStats[c.department].courses += 1;
      totalSeats += c.totalSeats;
    }
    
    // Seat utilization
    const allocatedSeats = allocations;

    const categoryStats = await prisma.student.groupBy({
      by: ['category'],
      _count: { category: true }
    });

    const recentActivity = await prisma.recentActivity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalCourses,
        totalAllocations: allocations,
        pendingAllocations: totalStudents - allocations,
        totalSeats,
        allocatedSeats,
        availableSeats: totalSeats - allocatedSeats,
        departmentStats,
        categoryStats,
        recentActivity
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
