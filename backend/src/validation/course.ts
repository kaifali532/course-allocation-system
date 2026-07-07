import { z } from 'zod';

export const createCourseSchema = z.object({
  body: z.object({
    courseId: z.string().min(1, "Course ID is required"),
    courseName: z.string().min(2, "Course Name must be at least 2 characters"),
    description: z.string().optional(),
    department: z.string().min(2, "Department is required"),
    totalSeats: z.number().int().positive(),
    generalSeats: z.number().int().min(0),
    obcSeats: z.number().int().min(0),
    scSeats: z.number().int().min(0),
    stSeats: z.number().int().min(0),
  }).refine(data => data.generalSeats + data.obcSeats + data.scSeats + data.stSeats === data.totalSeats, {
    message: "Category seats must sum to total seats",
    path: ["totalSeats"]
  })
});
