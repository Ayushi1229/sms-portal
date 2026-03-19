import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import {
  CoreApiError,
  getSessionAccessWhere,
  normalizeDateInput,
  parseAttendance,
  parseSessionMode,
  parseSessionStatus,
  requirePermission,
} from '@/lib/services/week8-core';

/**
 * GET /api/sessions/[id]
 * Get single session by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const session = await prisma.sessionRecord.findFirst({
      where: {
        id,
        ...getSessionAccessWhere(token),
      },
      include: {
        assignment: {
          include: {
            mentor: {
              include: {
                profile: true,
              },
            },
            student: {
              include: {
                profile: true,
              },
            },
            department: true,
          },
        },
        createdBy: {
          include: {
            profile: true,
          },
        },
        feedback: {
          include: {
            giver: {
              include: {
                profile: true,
              },
            },
            recipient: {
              include: {
                profile: true,
              },
            },
          },
        },
        attachments: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(session, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Get session error:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}

/**
 * PUT /api/sessions/[id]
 * Update session information
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    requirePermission(token, 'EDIT_SESSION');

    const { id } = await params;

    const body = await request.json();
    const {
      sessionDate,
      mode,
      location,
      topic,
      summary,
      actionItems,
      nextMeetingOn,
      status,
      attendance,
    } = body;

    const existingSession = await prisma.sessionRecord.findFirst({
      where: {
        id,
        ...getSessionAccessWhere(token),
      },
      include: {
        assignment: true,
      },
    });

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const normalizedDate = sessionDate ? normalizeDateInput(sessionDate) : undefined;
    const normalizedMode = mode ? parseSessionMode(mode) : undefined;
    const normalizedStatus = status ? parseSessionStatus(status) : undefined;
    const normalizedAttendance = attendance ? parseAttendance(attendance) : undefined;

    if (normalizedDate && normalizedDate.getTime() < Date.now() && existingSession.status === 'SCHEDULED') {
      return NextResponse.json({ error: 'Scheduled session date cannot be in the past' }, { status: 400 });
    }

    if (normalizedDate) {
      const windowStart = new Date(normalizedDate.getTime() - 45 * 60 * 1000);
      const windowEnd = new Date(normalizedDate.getTime() + 45 * 60 * 1000);
      const conflict = await prisma.sessionRecord.findFirst({
        where: {
          id: { not: id },
          status: 'SCHEDULED',
          sessionDate: {
            gte: windowStart,
            lte: windowEnd,
          },
          assignment: {
            OR: [
              { mentorId: existingSession.assignment.mentorId },
              { studentId: existingSession.assignment.studentId },
            ],
          },
        },
        select: { id: true },
      });

      if (conflict) {
        return NextResponse.json({ error: 'Time conflict detected for mentor or student' }, { status: 409 });
      }
    }

    const updatedSession = await prisma.sessionRecord.update({
      where: { id },
      data: {
        sessionDate: normalizedDate,
        mode: normalizedMode,
        location,
        topic,
        summary,
        actionItems,
        nextMeetingOn: nextMeetingOn ? normalizeDateInput(nextMeetingOn) : undefined,
        status: normalizedStatus,
        attendance: normalizedAttendance,
      },
      include: {
        assignment: {
          include: {
            mentor: {
              include: {
                profile: true,
              },
            },
            student: {
              include: {
                profile: true,
              },
            },
          },
        },
        createdBy: {
          include: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json({
      session: updatedSession,
      message: 'Session updated successfully',
    }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Update session error:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

/**
 * DELETE /api/sessions/[id]
 * Cancel/delete session
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    requirePermission(token, 'EDIT_SESSION');

    const { id } = await params;
    const session = await prisma.sessionRecord.findFirst({
      where: {
        id,
        ...getSessionAccessWhere(token),
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Cannot delete completed session' }, { status: 400 });
    }

    await prisma.sessionRecord.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json({ message: 'Session cancelled successfully' }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Delete session error:', error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
