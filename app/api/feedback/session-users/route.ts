import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import { getSessionAccessWhere, CoreApiError } from '@/lib/services/week8-core';
import { toErrorResponse } from '@/lib/api/error';

export async function GET(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const session = await prisma.sessionRecord.findFirst({
      where: {
        id: sessionId,
        ...getSessionAccessWhere(token),
      },
      include: {
        assignment: true
      }
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({
      mentorId: session.assignment.mentorId,
      studentId: session.assignment.studentId
    });
  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return toErrorResponse(error, 'Failed to fetch session users');
  }
}
