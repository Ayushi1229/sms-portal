import { describe, expect, it } from 'vitest';
import {
  assignmentsListQuerySchema,
  createAssignmentSchema,
  createFeedbackSchema,
  createGoalSchema,
  createSessionSchema,
  filesListQuerySchema,
} from '@/lib/validations/week10';

describe('week10 validation schemas', () => {
  it('parses list query defaults', () => {
    const parsed = assignmentsListQuerySchema.parse({});
    expect(parsed.page).toBe(1);
    expect(parsed.pageSize).toBe(10);
  });

  it('validates assignment creation payload', () => {
    const valid = createAssignmentSchema.safeParse({
      mentorId: '11111111-1111-1111-1111-111111111111',
      studentId: '22222222-2222-2222-2222-222222222222',
      departmentId: '33333333-3333-3333-3333-333333333333',
    });
    expect(valid.success).toBe(true);
  });

  it('rejects invalid session payload', () => {
    const invalid = createSessionSchema.safeParse({
      assignmentId: 'bad',
      sessionDate: 'invalid-date',
      mode: 'UNKNOWN',
      topic: 'x',
    });
    expect(invalid.success).toBe(false);
  });

  it('enforces feedback rating range', () => {
    const invalid = createFeedbackSchema.safeParse({
      sessionId: '11111111-1111-1111-1111-111111111111',
      giverUserId: '11111111-1111-1111-1111-111111111111',
      recipientUserId: '22222222-2222-2222-2222-222222222222',
      type: 'MENTOR_TO_STUDENT',
      rating: 7,
    });
    expect(invalid.success).toBe(false);
  });

  it('validates goal create payload and list file query enums', () => {
    const goal = createGoalSchema.safeParse({
      studentId: '11111111-1111-1111-1111-111111111111',
      title: 'Improve attendance',
      category: 'ACADEMIC',
    });
    expect(goal.success).toBe(true);

    const fileQuery = filesListQuerySchema.safeParse({ relatedType: 'SESSION' });
    expect(fileQuery.success).toBe(true);
  });
});
