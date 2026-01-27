import { z } from 'zod';

export const createStudentSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  enrollmentNumber: z.string().min(3),
  departmentId: z.string().uuid(),
  institutionId: z.string().uuid(),
  batch: z.string().optional(),
  semester: z.number().optional(),
  cgpa: z.number().min(0).max(10).optional(),
  phoneNumber: z.string().optional(),
  guardianName: z.string().optional(),
  guardianContact: z.string().optional(),
});

export const updateStudentSchema = createStudentSchema.partial().omit({ 
  email: true, 
  password: true 
});


export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;