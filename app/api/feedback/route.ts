import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import { Prisma } from '@prisma/client';
import { toErrorResponse } from '@/lib/api/error';
import {
  CoreApiError,
  getFeedbackAccessWhere,
  parseFeedbackType,
  validateFeedbackCreation,
} from '@/lib/services/week8-core';
import { paginatedResponse, parsePagination, shouldUsePagination } from '@/lib/api/pagination';
import { createFeedbackSchema, feedbackListQuerySchema } from '@/lib/validations/week10';

export async function GET(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const validatedQuery = feedbackListQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const search = validatedQuery.search || '';
    const type = validatedQuery.type || '';
    const shouldPaginate = shouldUsePagination(request);
    const { page, pageSize, skip } = parsePagination(request);

    const where: Prisma.SessionFeedbackWhereInput = {
      ...getFeedbackAccessWhere(token),
      ...(type ? { type: type as any } : {}),
      ...(search
        ? {
            OR: [
              { comments: { contains: search } },
              { session: { topic: { contains: search } } },
              { session: { assignment: { mentor: { profile: { firstName: { contains: search } } } } } },
              { session: { assignment: { mentor: { profile: { lastName: { contains: search } } } } } },
              { session: { assignment: { student: { profile: { firstName: { contains: search } } } } } },
              { session: { assignment: { student: { profile: { lastName: { contains: search } } } } } },
            ],
          }
        : {}),
    };

    const [feedback, total] = await Promise.all([
      prisma.sessionFeedback.findMany({
      where,
      include: {
        session: {
          include: {
            assignment: {
              include: {
                mentor: { include: { profile: true } },
                student: { include: { profile: true } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      ...(shouldPaginate ? { skip, take: pageSize } : {}),
    }),
      shouldPaginate ? prisma.sessionFeedback.count({ where }) : Promise.resolve(0),
    ]);

    const formattedFeedback = feedback.map(f => ({
      id: f.id,
      mentor: `${f.session.assignment.mentor.profile?.firstName || ''} ${f.session.assignment.mentor.profile?.lastName || ''}`.trim(),
      student: `${f.session.assignment.student.profile?.firstName || ''} ${f.session.assignment.student.profile?.lastName || ''}`.trim(),
      date: f.createdAt.toISOString().split('T')[0],
      rating: f.rating,
      category: f.type === 'MENTOR_TO_STUDENT' ? 'Mentor Feedback' : 'Student Feedback',
      status: 'Completed',
    }));

    if (shouldPaginate) {
      return NextResponse.json(paginatedResponse(formattedFeedback, total, page, pageSize));
    }

    return NextResponse.json(formattedFeedback);
  } catch (error: unknown) {
    if (error instanceof CoreApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    return toErrorResponse(error, 'Failed to fetch feedback');
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      sessionId,
      giverUserId,
      recipientUserId,
      type,
      rating,
      comments,
      visibility,
    } = createFeedbackSchema.parse(body);

    const parsedType = parseFeedbackType(type);
    const numericRating = Number(rating);

    await validateFeedbackCreation({
      sessionId,
      giverUserId,
      recipientUserId,
      type: parsedType,
      rating: numericRating,
      requester: token,
    });

    const [feedback] = await prisma.$transaction([
      prisma.sessionFeedback.create({
        data: {
          sessionId,
          giverUserId,
          recipientUserId,
          type: parsedType,
          rating: numericRating,
          comments,
          visibility: visibility || (type === 'MENTOR_TO_STUDENT' ? 'STUDENT' : 'MENTOR'),
        }
      }),
      prisma.sessionRecord.update({
        where: { id: sessionId },
        data: { status: 'COMPLETED' }
      })
    ]);

    return NextResponse.json(feedback, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof CoreApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    return toErrorResponse(error, 'Failed to create feedback');
  }
}
