import { z } from 'zod';

/**
 * Department validation schemas
 */

export const createDepartmentSchema = z.object({
  institutionId: z.string().uuid('Invalid institution ID'),
  name: z.string().min(2, 'Department name must be at least 2 characters'),
  code: z.string().min(2).max(10, 'Department code must be 2-10 characters'),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(2).optional(),
  code: z.string().min(2).max(10).optional(),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;