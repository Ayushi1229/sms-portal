import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/middleware/auth';
import { apiResponse, apiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';
/**
 * GET /api/goals/[id]
 * Get single goal by ID
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

    const goal = await prisma.goal.findUnique({
      where: { id: params.id },
      include: {
        student: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        mentor: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        updates: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!goal) {
      return apiError('Goal not found', 404);
    }

    return NextResponse.json(
      apiResponse(goal),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get goal error:', error);
    return apiError('Failed to fetch goal', 500);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PUT /api/goals/[id]
 * Update goal
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
      title,
      description,
      category,
      targetDate,
      metrics,
      milestones,
      status,
      progress,
    } = body;

    const updatedGoal = await prisma.goal.update({
      where: { id: params.id },
      data: {
        title,
        description,
        category,
        targetDate: targetDate ? new Date(targetDate) : undefined,
        metrics,
        milestones,
        status,
        progress,
      },
      include: {
        student: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        mentor: {
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
        goal: updatedGoal,
        message: 'Goal updated successfully',
      }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Update goal error:', error);
    return apiError('Failed to update goal', 500);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * DELETE /api/goals/[id]
 * Delete goal
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

    await prisma.goal.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      apiResponse({ message: 'Goal deleted successfully' }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Delete goal error:', error);
    return apiError('Failed to delete goal', 500);
  } finally {
    await prisma.$disconnect();
  }
}