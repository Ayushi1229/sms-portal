import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/middleware/auth';
import { apiResponse, apiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/sessions/[id]
 * Get single session by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = verifyToken(request);
    if (!token) {
      return apiError('Unauthorized', 401);
    }

    const session = await prisma.sessionRecord.findUnique({
      where: { id: params.id },
      include: {
        mentor: {
          include: {
            user: {
              include: {
                profile: true,
                department: true,
              },
            },
          },
        },
        student: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        feedback: {
          include: {
            user: {
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
      return apiError('Session not found', 404);
    }

    return NextResponse.json(
      apiResponse(session),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get session error:', error);
    return apiError('Failed to fetch session', 500);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PUT /api/sessions/[id]
 * Update session information
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = verifyToken(request);
    if (!token) {
      return apiError('Unauthorized', 401);
    }

    const body = await request.json();
    const {
      scheduledAt,
      duration,
      mode,
      location,
      agenda,
      meetingLink,
      status,
      attendance,
      actualStartTime,
      actualEndTime,
      summary,
      discussionPoints,
      actionItems,
      nextSteps,
    } = body;

    // Check if session exists
    const existingSession = await prisma.sessionRecord.findUnique({
      where: { id: params.id },
    });

    if (!existingSession) {
      return apiError('Session not found', 404);
    }

    // Update session
    const updatedSession = await prisma.sessionRecord.update({
      where: { id: params.id },
      data: {
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        duration,
        mode,
        location,
        agenda,
        meetingLink,
        status,
        attendance,
        actualStartTime: actualStartTime ? new Date(actualStartTime) : undefined,
        actualEndTime: actualEndTime ? new Date(actualEndTime) : undefined,
        summary,
        discussionPoints,
        actionItems,
        nextSteps,
      },
      include: {
        mentor: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        student: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      apiResponse({
        session: updatedSession,
        message: 'Session updated successfully',
      }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Update session error:', error);
    return apiError('Failed to update session', 500);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * DELETE /api/sessions/[id]
 * Cancel/delete session
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = verifyToken(request);
    if (!token) {
      return apiError('Unauthorized', 401);
    }

    // Check if session exists
    const session = await prisma.sessionRecord.findUnique({
      where: { id: params.id },
    });

    if (!session) {
      return apiError('Session not found', 404);
    }

    // Only allow deletion of scheduled sessions
    if (session.status === 'COMPLETED') {
      return apiError('Cannot delete completed session', 400);
    }

    // Update status to cancelled instead of hard delete
    await prisma.sessionRecord.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json(
      apiResponse({ message: 'Session cancelled successfully' }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Delete session error:', error);
    return apiError('Failed to delete session', 500);
  } finally {
    await prisma.$disconnect();
  }
}