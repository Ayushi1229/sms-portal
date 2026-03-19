import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/middleware/auth';
import { Prisma } from '@prisma/client';
import { toErrorResponse } from '@/lib/api/error';
import {
  CoreApiError,
  getSessionAccessWhere,
  parseSessionMode,
  requirePermission,
  normalizeDateInput,
  validateSessionCreation,
} from '@/lib/services/week8-core';
import { paginatedResponse, parsePagination, shouldUsePagination } from '@/lib/api/pagination';
import { createSessionSchema, sessionsListQuerySchema } from '@/lib/validations/week10';

/**
 * GET /api/sessions
 */
export async function GET(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const validatedQuery = sessionsListQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const search = validatedQuery.search || '';
    const status = validatedQuery.status || '';
    const mode = validatedQuery.mode || '';
    const dateFrom = validatedQuery.dateFrom;
    const dateTo = validatedQuery.dateTo;
    const shouldPaginate = shouldUsePagination(request);
    const { page, pageSize, skip } = parsePagination(request);

    const where: Prisma.SessionRecordWhereInput = {
      ...getSessionAccessWhere(token),
      ...(status ? { status: status as any } : {}),
      ...(mode ? { mode: mode as any } : {}),
      ...(dateFrom || dateTo
        ? {
            sessionDate: {
              ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
              ...(dateTo ? { lte: new Date(dateTo) } : {}),
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { topic: { contains: search } },
              { location: { contains: search } },
              { assignment: { mentor: { profile: { firstName: { contains: search } } } } },
              { assignment: { mentor: { profile: { lastName: { contains: search } } } } },
              { assignment: { student: { profile: { firstName: { contains: search } } } } },
              { assignment: { student: { profile: { lastName: { contains: search } } } } },
            ],
          }
        : {}),
    };

    const [sessions, total] = await Promise.all([
      prisma.sessionRecord.findMany({
      where,
      include: {
        assignment: {
          include: {
            mentor: { include: { profile: true } },
            student: { include: { profile: true } }
          }
        },
        createdBy: { include: { profile: true } }
      },
      orderBy: { sessionDate: 'desc' },
      ...(shouldPaginate ? { skip, take: pageSize } : {}),
    }),
      shouldPaginate ? prisma.sessionRecord.count({ where }) : Promise.resolve(0),
    ]);

    const formattedSessions = sessions.map(s => ({
      id: s.id,
      mentor: `${s.assignment.mentor.profile?.firstName || ''} ${s.assignment.mentor.profile?.lastName || ''}`.trim(),
      student: `${s.assignment.student.profile?.firstName || ''} ${s.assignment.student.profile?.lastName || ''}`.trim(),
      date: s.sessionDate.toISOString().split('T')[0],
      time: s.sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: s.location || 'N/A',
      mode: s.mode,
      status: s.status,
      topic: s.topic,
    }));

    if (shouldPaginate) {
      return NextResponse.json(paginatedResponse(formattedSessions, total, page, pageSize));
    }

    return NextResponse.json(formattedSessions);
  } catch (error: unknown) {
    if (error instanceof CoreApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    return toErrorResponse(error, 'Failed to fetch sessions');
  }
}

/**
 * POST /api/sessions
 */
export async function POST(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    requirePermission(token, 'CREATE_SESSION');

    const body = await request.json();
    const { assignmentId, sessionDate, mode, location, topic } = createSessionSchema.parse(body);

    const normalizedDate = normalizeDateInput(sessionDate);
    const normalizedMode = parseSessionMode(mode);

    await validateSessionCreation({
      assignmentId,
      sessionDate: normalizedDate,
      requester: token,
    });

    const session = await prisma.sessionRecord.create({
      data: {
        assignmentId,
        sessionDate: normalizedDate,
        mode: normalizedMode,
        location,
        topic,
        createdById: token.id,
        status: 'SCHEDULED',
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof CoreApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    return toErrorResponse(error, 'Failed to create session');
  }
}