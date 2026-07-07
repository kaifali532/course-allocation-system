import { z } from 'zod';

export const createStudentSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, "Student ID is required"),
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    gender: z.enum(["Male", "Female", "Other"]),
    marks: z.number().min(0).max(100),
    category: z.enum(["General", "OBC", "SC", "ST"]),
    applicationDate: z.string().datetime(),
    preferredCourse1Id: z.string().uuid("Invalid Course ID"),
    preferredCourse2Id: z.string().uuid("Invalid Course ID").optional(),
    preferredCourse3Id: z.string().uuid("Invalid Course ID").optional(),
  })
});
