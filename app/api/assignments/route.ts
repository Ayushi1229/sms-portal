import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/middleware/auth';
import { Prisma } from '@prisma/client';
import { toErrorResponse } from '@/lib/api/error';
import {
  CoreApiError,
  getAssignmentAccessWhere,
  getStudentProgressMap,
  requirePermission,
  validateAssignmentCreation,
} from '@/lib/services/week8-core';
import { paginatedResponse, parsePagination, shouldUsePagination } from '@/lib/api/pagination';
import { createAuditLog } from '@/lib/services/audit';
import { assignmentsListQuerySchema, createAssignmentSchema } from '@/lib/validations/week10';

/**
 * GET /api/assignments
 */
export async function GET(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const validatedQuery = assignmentsListQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const search = validatedQuery.search || '';
    const status = validatedQuery.status || '';
    const shouldPaginate = shouldUsePagination(request);
    const { page, pageSize, skip } = parsePagination(request);

    const where: Prisma.MentorAssignmentWhereInput = {
      ...getAssignmentAccessWhere(token),
      ...(status ? { status: status as any } : {}),
      ...(search
        ? {
            OR: [
              { mentor: { profile: { firstName: { contains: search } } } },
              { mentor: { profile: { lastName: { contains: search } } } },
              { student: { profile: { firstName: { contains: search } } } },
              { student: { profile: { lastName: { contains: search } } } },
              { department: { name: { contains: search } } },
            ],
          }
        : {}),
    };

    const [assignments, total] = await Promise.all([
      prisma.mentorAssignment.findMany({
      where,
      include: {
        mentor: { include: { profile: true } },
        student: { include: { profile: true } },
        department: true,
      },
      orderBy: { createdAt: 'desc' },
      ...(shouldPaginate ? { skip, take: pageSize } : {}),
    }),
      shouldPaginate ? prisma.mentorAssignment.count({ where }) : Promise.resolve(0),
    ]);

    const progressMap = await getStudentProgressMap(assignments.map(a => a.studentId));

    const formattedAssignments = assignments.map(a => ({
      id: a.id,
      mentor: `${a.mentor.profile?.firstName || ''} ${a.mentor.profile?.lastName || ''}`.trim(),
      student: `${a.student.profile?.firstName || ''} ${a.student.profile?.lastName || ''}`.trim(),
      assignedDate: a.createdAt.toISOString().split('T')[0],
      status: a.status,
      department: a.department?.name || 'N/A',
      progress: progressMap[a.studentId] ?? 0,
    }));

    if (shouldPaginate) {
      return NextResponse.json(paginatedResponse(formattedAssignments, total, page, pageSize));
    }

    return NextResponse.json(formattedAssignments);
  } catch (error: unknown) {
    if (error instanceof CoreApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    return toErrorResponse(error, 'Failed to fetch assignments');
  }
}

/**
 * POST /api/assignments
 */
export async function POST(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    requirePermission(token, 'CREATE_ASSIGNMENT');

    const body = await request.json();
    const { mentorId, studentId, departmentId } = createAssignmentSchema.parse(body);

    await validateAssignmentCreation({ mentorId, studentId, departmentId });

    if (token.departmentId && token.departmentId !== departmentId) {
      return NextResponse.json({ error: 'Forbidden: cross-department assignment is not allowed' }, { status: 403 });
    }

    const assignment = await prisma.mentorAssignment.create({
      data: {
        mentorId,
        studentId,
        departmentId,
        assignedById: token.id,
        status: 'ACTIVE',
      },
    });

    // Logging action
    await createAuditLog({
      userId: token.id,
      action: 'CREATE_ASSIGNMENT',
      entity: 'MentorAssignment',
      entityId: assignment.id,
      afterState: assignment,
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof CoreApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    return toErrorResponse(error, 'Failed to create assignment');
  }
}
