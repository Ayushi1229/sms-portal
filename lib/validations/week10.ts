import { z } from 'zod';

const optionalString = z.string().trim().optional().transform(v => (v === '' ? undefined : v));

const boolFromString = z
  .union([z.boolean(), z.string()])
  .optional()
  .transform(value => {
    if (typeof value === 'boolean') return value;
    if (!value) return undefined;
    return value.toLowerCase() === 'true';
  });

const intFromString = (defaultValue: number, min = 1, max = 100) =>
  z
    .union([z.number(), z.string()])
    .optional()
    .transform(value => {
      if (value === undefined || value === null || value === '') return defaultValue;
      const n = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(n)) return defaultValue;
      return Math.min(Math.max(Math.floor(n), min), max);
    });

export const commonListQuerySchema = z.object({
  search: optionalString,
  page: intFromString(1),
  pageSize: intFromString(10),
  paginated: boolFromString,
});

export const assignmentsListQuerySchema = commonListQuerySchema.extend({
  status: z.enum(['ACTIVE', 'PAUSED', 'ENDED']).optional(),
});

export const sessionsListQuerySchema = commonListQuerySchema.extend({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).optional(),
  mode: z.enum(['IN_PERSON', 'ONLINE', 'PHONE']).optional(),
  dateFrom: optionalString,
  dateTo: optionalString,
});

export const feedbackListQuerySchema = commonListQuerySchema.extend({
  type: z.enum(['MENTOR_TO_STUDENT', 'STUDENT_TO_MENTOR']).optional(),
});

export const goalsListQuerySchema = commonListQuerySchema.extend({
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'AT_RISK', 'COMPLETED']).optional(),
  category: z.enum(['ACADEMIC', 'BEHAVIORAL', 'CAREER', 'WELLNESS']).optional(),
});

export const filesListQuerySchema = commonListQuerySchema.extend({
  relatedType: z.enum(['SESSION', 'FEEDBACK', 'GOAL', 'ASSIGNMENT']).optional(),
});

export const createAssignmentSchema = z.object({
  mentorId: z.string().uuid(),
  studentId: z.string().uuid(),
  departmentId: z.string().uuid(),
});

export const createSessionSchema = z.object({
  assignmentId: z.string().uuid(),
  sessionDate: z.string().datetime(),
  mode: z.enum(['IN_PERSON', 'ONLINE', 'PHONE']),
  location: optionalString,
  topic: z.string().trim().min(3).max(500),
});

export const createFeedbackSchema = z.object({
  sessionId: z.string().uuid(),
  giverUserId: z.string().uuid(),
  recipientUserId: z.string().uuid(),
  type: z.enum(['MENTOR_TO_STUDENT', 'STUDENT_TO_MENTOR']),
  rating: z.coerce.number().int().min(1).max(5),
  comments: optionalString,
  visibility: z.enum(['MENTOR', 'STUDENT', 'DEPARTMENT_ADMIN']).optional(),
});

export const createGoalSchema = z.object({
  studentId: z.string().uuid(),
  title: z.string().trim().min(3).max(255),
  category: z.enum(['ACADEMIC', 'BEHAVIORAL', 'CAREER', 'WELLNESS']),
  description: optionalString,
  targetDate: optionalString,
  createdById: z.string().uuid().optional(),
});

export const uploadFileMetaSchema = z.object({
  relatedType: z.enum(['SESSION', 'FEEDBACK', 'GOAL', 'ASSIGNMENT']).nullable().optional(),
  sessionId: z.string().uuid().nullable().optional(),
  feedbackId: z.string().uuid().nullable().optional(),
  goalId: z.string().uuid().nullable().optional(),
  assignmentId: z.string().uuid().nullable().optional(),
});
