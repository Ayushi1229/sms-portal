import { z } from 'zod';

/**
 * Goal validation schemas
 */

export const createGoalSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  category: z.enum(['ACADEMIC', 'CAREER', 'PERSONAL']),
  targetDate: z.string().datetime().optional(),
  metrics: z.string().optional(),
  milestones: z.array(z.object({
    name: z.string(),
    targetDate: z.string().datetime().optional(),
  })).optional(),
});

export const updateGoalSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'ABANDONED']).optional(),
  progress: z.number().min(0).max(100).optional(),
  metrics: z.string().optional(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
