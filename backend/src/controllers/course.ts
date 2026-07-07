import { Request, Response } from 'express';
import prisma from '../config/db';
import { logActivity } from '../utils/activity';

export const createCourse = async (req: Request, res: Response) => {
  try {
    const course = await prisma.course.create({ data: req.body });
    await logActivity('Course Created', `Created course ${course.courseName} (${course.courseId})`, 'SUCCESS');
    res.status(201).json({ success: true, data: course });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCourses = async (req: Request, res: Response) => {
  try {
    const { search = '', dept = '' } = req.query;
    const where: any = {};
    
    if (search) {
      where.OR = [
        { courseName: { contains: String(search), mode: 'insensitive' } },
        { courseId: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    
    if (dept) {
      where.department = String(dept);
    }

    const courses = await prisma.course.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data: courses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      select: { department: true },
      distinct: ['department']
    });
    const depts = courses.map(c => c.department).filter(Boolean);
    res.status(200).json({ success: true, data: depts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const course = await prisma.course.update({
      where: { id },
      data: req.body
    });
    await logActivity('Course Updated', `Updated course ${course.courseName} (${course.courseId})`, 'INFO');
    res.status(200).json({ success: true, data: course });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const course = await prisma.course.delete({ where: { id } });
    await logActivity('Course Deleted', `Deleted course ${course.courseName} (${course.courseId})`, 'WARNING');
    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
