import { Request, Response } from 'express';
import prisma from '../config/db';

export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = await prisma.student.create({ data: req.body });
    res.status(201).json({ success: true, data: student });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where = search ? {
      OR: [
        { fullName: { contains: String(search), mode: 'insensitive' as any } },
        { studentId: { contains: String(search), mode: 'insensitive' as any } },
      ]
    } : {};

    const [students, total] = await Promise.all([
      prisma.student.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.student.count({ where })
    ]);

    res.status(200).json({ success: true, data: students, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const student = await prisma.student.update({
      where: { id },
      data: req.body
    });
    res.status(200).json({ success: true, data: student });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.student.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
