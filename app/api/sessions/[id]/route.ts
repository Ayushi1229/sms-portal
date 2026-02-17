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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return apiError('Unauthorized', 401);
    }

    const { id } = await params;
    const session = await prisma.sessionRecord.findUnique({
      where: { id },
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
      return apiError('Session not found', 404);
    }

    return NextResponse.json(
      apiResponse(session),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get session error:', error);
    return apiError('Failed to fetch session', 500);
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
      return apiError('Unauthorized', 401);
    }

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

    // Check if session exists
    const existingSession = await prisma.sessionRecord.findUnique({
      where: { id },
    });

    if (!existingSession) {
      return apiError('Session not found', 404);
    }

    // Update session
    const updatedSession = await prisma.sessionRecord.update({
      where: { id },
      data: {
        sessionDate: sessionDate ? new Date(sessionDate) : undefined,
        mode,
        location,
        topic,
        summary,
        actionItems,
        nextMeetingOn: nextMeetingOn ? new Date(nextMeetingOn) : undefined,
        status,
        attendance,
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
      return apiError('Unauthorized', 401);
    }

    const { id } = await params;
    // Check if session exists
    const session = await prisma.sessionRecord.findUnique({
      where: { id },
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
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json(
      apiResponse({ message: 'Session cancelled successfully' }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Delete session error:', error);
    return apiError('Failed to delete session', 500);
  }
}
