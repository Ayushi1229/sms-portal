import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeAuthedRequest, seedUsers } from './helpers/auth';

const prismaMock = {
  sessionRecord: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  goal: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  sessionFeedback: {
    findFirst: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}));

vi.mock('@/lib/services/week8-core', async () => {
  class CoreApiError extends Error {
    status: number;

    constructor(message: string, status = 400) {
      super(message);
      this.status = status;
    }
  }

  return {
    CoreApiError,
    requirePermission: (token: { roleId: number }, permission: string) => {
      const adminRoles = [1, 2, 3];
      const allowedEditSession = [...adminRoles, 4];
      const allowedEditGoal = [...adminRoles, 4];

      if (permission === 'EDIT_SESSION' && !allowedEditSession.includes(token.roleId)) {
        throw new CoreApiError('Forbidden: insufficient permissions', 403);
      }
      if (permission === 'EDIT_GOAL' && !allowedEditGoal.includes(token.roleId)) {
        throw new CoreApiError('Forbidden: insufficient permissions', 403);
      }
    },
    getSessionAccessWhere: vi.fn().mockReturnValue({}),
    getGoalAccessWhere: vi.fn().mockReturnValue({}),
    getFeedbackAccessWhere: vi.fn().mockReturnValue({}),
    normalizeDateInput: (v: string | Date) => new Date(v),
    parseAttendance: (v: string) => v,
    parseSessionMode: (v: string) => v,
    parseSessionStatus: (v: string) => v,
    parseGoalCategory: (v: string) => v,
    parseGoalStatus: (v: string) => v,
    parseFeedbackVisibility: (v: string) => v,
    isAdminUser: (token: { roleId: number }) => [1, 2, 3].includes(token.roleId),
  };
});

describe('Authenticated ID route update/delete checks', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    vi.clearAllMocks();
  });

  it('returns conflict when session reschedule overlaps another scheduled session', async () => {
    const { PUT } = await import('@/app/api/sessions/[id]/route');

    prismaMock.sessionRecord.findFirst
      .mockResolvedValueOnce({
        id: 'session-1',
        status: 'SCHEDULED',
        assignment: {
          mentorId: seedUsers.mentor.id,
          studentId: seedUsers.student.id,
        },
      })
      .mockResolvedValueOnce({ id: 'session-2' });

    const request = await makeAuthedRequest('/api/sessions/session-1', seedUsers.departmentAdmin, 'PUT', {
      sessionDate: '2099-01-01T10:00:00.000Z',
      mode: 'ONLINE',
      topic: 'Conflict check session',
    });

    const response = await PUT(request, { params: Promise.resolve({ id: 'session-1' }) });
    expect(response.status).toBe(409);
  });

  it('updates goal and auto-completes when progress reaches 100', async () => {
    const { PUT } = await import('@/app/api/goals/[id]/route');

    prismaMock.goal.findFirst.mockResolvedValue({ id: 'goal-1' });
    prismaMock.goal.update.mockResolvedValue({
      id: 'goal-1',
      progressPct: 100,
      status: 'COMPLETED',
    });

    const request = await makeAuthedRequest('/api/goals/goal-1', seedUsers.mentor, 'PUT', {
      progressPct: 100,
      title: 'Reach 100 percent completion',
    });

    const response = await PUT(request, { params: Promise.resolve({ id: 'goal-1' }) });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(prismaMock.goal.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'COMPLETED',
          progressPct: 100,
        }),
      })
    );
    expect(body.goal.status).toBe('COMPLETED');
  });

  it('rejects feedback update when user is not owner and not admin', async () => {
    const { PUT } = await import('@/app/api/feedback/[id]/route');

    prismaMock.sessionFeedback.findFirst.mockResolvedValue({
      id: 'fb-1',
      giverUserId: seedUsers.mentor.id,
    });

    const request = await makeAuthedRequest('/api/feedback/fb-1', seedUsers.student, 'PUT', {
      rating: 4,
      comments: 'Trying to edit another user feedback',
    });

    const response = await PUT(request, { params: Promise.resolve({ id: 'fb-1' }) });
    expect(response.status).toBe(403);
  });

  it('rejects feedback update when rating is outside valid range', async () => {
    const { PUT } = await import('@/app/api/feedback/[id]/route');

    prismaMock.sessionFeedback.findFirst.mockResolvedValue({
      id: 'fb-2',
      giverUserId: seedUsers.student.id,
    });

    const request = await makeAuthedRequest('/api/feedback/fb-2', seedUsers.student, 'PUT', {
      rating: 8,
    });

    const response = await PUT(request, { params: Promise.resolve({ id: 'fb-2' }) });
    expect(response.status).toBe(400);
  });

  it('deletes feedback when requester is the owner', async () => {
    const { DELETE } = await import('@/app/api/feedback/[id]/route');

    prismaMock.sessionFeedback.findFirst.mockResolvedValue({
      id: 'fb-3',
      giverUserId: seedUsers.student.id,
    });
    prismaMock.sessionFeedback.delete.mockResolvedValue({ id: 'fb-3' });

    const request = await makeAuthedRequest('/api/feedback/fb-3', seedUsers.student, 'DELETE');

    const response = await DELETE(request, { params: Promise.resolve({ id: 'fb-3' }) });
    expect(response.status).toBe(200);
    expect(prismaMock.sessionFeedback.delete).toHaveBeenCalledWith({ where: { id: 'fb-3' } });
  });
});
