import { Request, Response } from 'express';
import prisma from '../config/db';

export const createCourse = async (req: Request, res: Response) => {
  try {
    const course = await prisma.course.create({ data: req.body });
    res.status(201).json({ success: true, data: course });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCourses = async (req: Request, res: Response) => {
  try {
    const { search = '' } = req.query;
    const where = search ? {
      OR: [
        { courseName: { contains: String(search), mode: 'insensitive' as any } },
        { courseId: { contains: String(search), mode: 'insensitive' as any } },
      ]
    } : {};
    const courses = await prisma.course.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data: courses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
