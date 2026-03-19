import {
  Attendance,
  FeedbackType,
  FeedbackVisibility,
  GoalCategory,
  GoalStatus,
  Prisma,
  SessionMode,
  SessionStatus,
} from '@prisma/client';
import { canPerformAction, isAdmin, Role } from '@/lib/auth/permissions';
import { DecodedToken } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';

export class CoreApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'CoreApiError';
    this.status = status;
  }
}

export function requirePermission(token: DecodedToken, permission: Parameters<typeof canPerformAction>[1]) {
  if (!canPerformAction(token.roleId, permission)) {
    throw new CoreApiError('Forbidden: insufficient permissions', 403);
  }
}

export function isAdminUser(token: DecodedToken): boolean {
  return isAdmin(token.roleId);
}

export function normalizeDateInput(value: string | Date): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new CoreApiError('Invalid date value', 400);
  }
  return date;
}

export function parseSessionMode(value: string): SessionMode {
  if (!Object.values(SessionMode).includes(value as SessionMode)) {
    throw new CoreApiError('Invalid session mode', 400);
  }
  return value as SessionMode;
}

export function parseGoalCategory(value: string): GoalCategory {
  if (!Object.values(GoalCategory).includes(value as GoalCategory)) {
    throw new CoreApiError('Invalid goal category', 400);
  }
  return value as GoalCategory;
}

export function parseFeedbackType(value: string): FeedbackType {
  if (!Object.values(FeedbackType).includes(value as FeedbackType)) {
    throw new CoreApiError('Invalid feedback type', 400);
  }
  return value as FeedbackType;
}

export function parseSessionStatus(value: string): SessionStatus {
  if (!Object.values(SessionStatus).includes(value as SessionStatus)) {
    throw new CoreApiError('Invalid session status', 400);
  }
  return value as SessionStatus;
}

export function parseAttendance(value: string): Attendance {
  if (!Object.values(Attendance).includes(value as Attendance)) {
    throw new CoreApiError('Invalid attendance value', 400);
  }
  return value as Attendance;
}

export function parseGoalStatus(value: string): GoalStatus {
  if (!Object.values(GoalStatus).includes(value as GoalStatus)) {
    throw new CoreApiError('Invalid goal status', 400);
  }
  return value as GoalStatus;
}

export function parseFeedbackVisibility(value: string): FeedbackVisibility {
  if (!Object.values(FeedbackVisibility).includes(value as FeedbackVisibility)) {
    throw new CoreApiError('Invalid feedback visibility', 400);
  }
  return value as FeedbackVisibility;
}

export function getAssignmentAccessWhere(token: DecodedToken): Prisma.MentorAssignmentWhereInput {
  if (isAdminUser(token)) {
    return token.departmentId ? { departmentId: token.departmentId } : {};
  }

  if (token.roleId === Role.MENTOR) {
    return { mentorId: token.id };
  }

  if (token.roleId === Role.STUDENT) {
    return { studentId: token.id };
  }

  throw new CoreApiError('Forbidden: unsupported role', 403);
}

export function getSessionAccessWhere(token: DecodedToken): Prisma.SessionRecordWhereInput {
  if (isAdminUser(token)) {
    if (!token.departmentId) {
      return {};
    }

    return {
      assignment: {
        departmentId: token.departmentId,
      },
    };
  }

  if (token.roleId === Role.MENTOR) {
    return {
      assignment: {
        mentorId: token.id,
      },
    };
  }

  if (token.roleId === Role.STUDENT) {
    return {
      assignment: {
        studentId: token.id,
      },
    };
  }

  throw new CoreApiError('Forbidden: unsupported role', 403);
}

export function getGoalAccessWhere(token: DecodedToken): Prisma.GoalWhereInput {
  if (isAdminUser(token)) {
    if (!token.departmentId) {
      return {};
    }

    return {
      student: {
        departmentId: token.departmentId,
      },
    };
  }

  if (token.roleId === Role.MENTOR) {
    return {
      OR: [
        { createdById: token.id },
        {
          student: {
            studentAssignments: {
              some: {
                mentorId: token.id,
                status: 'ACTIVE',
              },
            },
          },
        },
      ],
    };
  }

  if (token.roleId === Role.STUDENT) {
    return { studentId: token.id };
  }

  throw new CoreApiError('Forbidden: unsupported role', 403);
}

export function getFeedbackAccessWhere(token: DecodedToken): Prisma.SessionFeedbackWhereInput {
  if (isAdminUser(token)) {
    if (!token.departmentId) {
      return {};
    }

    return {
      session: {
        assignment: {
          departmentId: token.departmentId,
        },
      },
    };
  }

  return {
    OR: [{ giverUserId: token.id }, { recipientUserId: token.id }],
  };
}

export async function validateAssignmentCreation(input: {
  mentorId: string;
  studentId: string;
  departmentId: string;
}) {
  const [mentor, student] = await Promise.all([
    prisma.user.findUnique({ where: { id: input.mentorId }, include: { mentorProfile: true } }),
    prisma.user.findUnique({ where: { id: input.studentId }, include: { studentProfile: true } }),
  ]);

  if (!mentor || mentor.roleId !== Role.MENTOR) {
    throw new CoreApiError('Selected mentor is invalid', 400);
  }

  if (!student || student.roleId !== Role.STUDENT) {
    throw new CoreApiError('Selected student is invalid', 400);
  }

  if (mentor.departmentId !== input.departmentId || student.departmentId !== input.departmentId) {
    throw new CoreApiError('Mentor, student, and assignment must belong to same department', 400);
  }

  const [existingAssignment, activeMentorAssignments] = await Promise.all([
    prisma.mentorAssignment.findFirst({
      where: {
        studentId: input.studentId,
        status: 'ACTIVE',
      },
      select: { id: true },
    }),
    prisma.mentorAssignment.count({
      where: {
        mentorId: input.mentorId,
        status: 'ACTIVE',
      },
    }),
  ]);

  if (existingAssignment) {
    throw new CoreApiError('Student already has an active mentor assignment', 409);
  }

  const maxMentees = mentor.mentorProfile?.maxMentees ?? 15;
  if (activeMentorAssignments >= maxMentees) {
    throw new CoreApiError('Mentor has reached maximum mentee capacity', 409);
  }
}

export async function validateSessionCreation(input: {
  assignmentId: string;
  sessionDate: Date;
  requester: DecodedToken;
}) {
  const assignment = await prisma.mentorAssignment.findUnique({
    where: { id: input.assignmentId },
    include: {
      mentor: true,
      student: true,
    },
  });

  if (!assignment) {
    throw new CoreApiError('Assignment not found', 404);
  }

  if (assignment.status !== 'ACTIVE') {
    throw new CoreApiError('Sessions can only be created for active assignments', 400);
  }

  if (input.requester.departmentId && assignment.departmentId !== input.requester.departmentId) {
    throw new CoreApiError('Forbidden: cross-department access denied', 403);
  }

  if (input.requester.roleId === Role.MENTOR && assignment.mentorId !== input.requester.id) {
    throw new CoreApiError('Mentors can only schedule sessions for their assignments', 403);
  }

  if (input.requester.roleId === Role.STUDENT) {
    throw new CoreApiError('Students are not allowed to schedule sessions', 403);
  }

  if (input.sessionDate.getTime() < Date.now()) {
    throw new CoreApiError('Session date must be in the future', 400);
  }

  const windowStart = new Date(input.sessionDate.getTime() - 45 * 60 * 1000);
  const windowEnd = new Date(input.sessionDate.getTime() + 45 * 60 * 1000);

  const conflict = await prisma.sessionRecord.findFirst({
    where: {
      status: 'SCHEDULED',
      sessionDate: {
        gte: windowStart,
        lte: windowEnd,
      },
      assignment: {
        OR: [{ mentorId: assignment.mentorId }, { studentId: assignment.studentId }],
      },
    },
    select: { id: true },
  });

  if (conflict) {
    throw new CoreApiError('Time conflict detected for mentor or student', 409);
  }
}

export async function validateFeedbackCreation(input: {
  sessionId: string;
  giverUserId: string;
  recipientUserId: string;
  type: FeedbackType;
  rating: number;
  requester: DecodedToken;
}) {
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new CoreApiError('Rating must be an integer between 1 and 5', 400);
  }

  const session = await prisma.sessionRecord.findUnique({
    where: { id: input.sessionId },
    include: {
      assignment: true,
    },
  });

  if (!session) {
    throw new CoreApiError('Session not found', 404);
  }

  if (input.requester.departmentId && session.assignment.departmentId !== input.requester.departmentId) {
    throw new CoreApiError('Forbidden: cross-department access denied', 403);
  }

  if (!isAdminUser(input.requester) && input.requester.id !== input.giverUserId) {
    throw new CoreApiError('You can only submit feedback as yourself', 403);
  }

  const mentorId = session.assignment.mentorId;
  const studentId = session.assignment.studentId;

  if (input.type === 'MENTOR_TO_STUDENT') {
    if (input.giverUserId !== mentorId || input.recipientUserId !== studentId) {
      throw new CoreApiError('Mentor-to-student feedback must match assignment users', 400);
    }
  } else {
    if (input.giverUserId !== studentId || input.recipientUserId !== mentorId) {
      throw new CoreApiError('Student-to-mentor feedback must match assignment users', 400);
    }
  }

  const existingFeedback = await prisma.sessionFeedback.findFirst({
    where: {
      sessionId: input.sessionId,
      giverUserId: input.giverUserId,
      type: input.type,
    },
    select: { id: true },
  });

  if (existingFeedback) {
    throw new CoreApiError('Feedback already submitted for this session and type', 409);
  }
}

export async function validateGoalCreation(input: {
  studentId: string;
  requester: DecodedToken;
}) {
  const student = await prisma.user.findUnique({
    where: { id: input.studentId },
    select: {
      id: true,
      roleId: true,
      departmentId: true,
    },
  });

  if (!student || student.roleId !== Role.STUDENT) {
    throw new CoreApiError('Invalid student selected for goal', 400);
  }

  if (input.requester.departmentId && student.departmentId !== input.requester.departmentId) {
    throw new CoreApiError('Forbidden: cross-department access denied', 403);
  }

  if (input.requester.roleId === Role.MENTOR) {
    const assignment = await prisma.mentorAssignment.findFirst({
      where: {
        mentorId: input.requester.id,
        studentId: input.studentId,
        status: 'ACTIVE',
      },
      select: { id: true },
    });

    if (!assignment) {
      throw new CoreApiError('Mentor can create goals only for assigned students', 403);
    }
  }
}

export async function getStudentProgressMap(studentIds: string[]): Promise<Record<string, number>> {
  if (studentIds.length === 0) {
    return {};
  }

  const aggregated = await prisma.goal.groupBy({
    by: ['studentId'],
    where: {
      studentId: {
        in: studentIds,
      },
    },
    _avg: {
      progressPct: true,
    },
  });

  return aggregated.reduce<Record<string, number>>((acc, row) => {
    acc[row.studentId] = Math.round(row._avg.progressPct ?? 0);
    return acc;
  }, {});
}