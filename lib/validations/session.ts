import { z } from 'zod';

/**
 * Session validation schemas
 */

export const createSessionSchema = z.object({
  mentorId: z.string().uuid('Invalid mentor ID'),
  studentId: z.string().uuid('Invalid student ID'),
  scheduledAt: z.string().datetime('Invalid date format'),
  duration: z.number().int().min(15).max(480).default(60),
  mode: z.enum(['IN_PERSON', 'VIRTUAL', 'HYBRID']),
  location: z.string().optional(),
  agenda: z.string().optional(),
  meetingLink: z.string().url().optional(),
});

export const updateSessionSchema = z.object({
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  attendance: z.enum(['PENDING', 'ATTENDED', 'ABSENT']).optional(),
  notes: z.string().optional(),
  duration: z.number().int().min(15).max(480).optional(),
  agenda: z.string().optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
