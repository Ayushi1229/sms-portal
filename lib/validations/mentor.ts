import { z } from 'zod';

/**
 * Mentor validation schemas
 */

export const createMentorSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  designation: z.string().optional(),
  specialization: z.string().optional(),
  capacityDefault: z.number().int().min(1).default(10),
  maxMentees: z.number().int().min(1).default(15),
  availabilityStatus: z.enum(['AVAILABLE', 'LIMITED', 'UNAVAILABLE']).default('AVAILABLE'),
});

export const updateMentorSchema = z.object({
  designation: z.string().optional(),
  specialization: z.string().optional(),
  capacityDefault: z.number().int().min(1).optional(),
  maxMentees: z.number().int().min(1).optional(),
  availabilityStatus: z.enum(['AVAILABLE', 'LIMITED', 'UNAVAILABLE']).optional(),
});

export type CreateMentorInput = z.infer<typeof createMentorSchema>;
export type UpdateMentorInput = z.infer<typeof updateMentorSchema>;
