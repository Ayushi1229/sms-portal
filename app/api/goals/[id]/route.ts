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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return apiError('Unauthorized', 401);
    }

    const { id } = await params;
    const goal = await prisma.goal.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            profile: true,
          },
        },
        createdBy: {
          include: {
            profile: true,
          },
        },
        updates: {
          orderBy: { createdAt: 'desc' },
          include: {
            notedBy: {
              include: {
                profile: true,
              },
            },
          },
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
  }
}

/**
 * PUT /api/goals/[id]
 * Update goal
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
      title,
      description,
      category,
      targetDate,
      status,
      progressPct,
    } = body;

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        title,
        description,
        category,
        targetDate: targetDate ? new Date(targetDate) : undefined,
        status,
        progressPct: progressPct !== undefined ? progressPct : undefined,
      },
      include: {
        student: {
          include: {
            profile: true,
          },
        },
        createdBy: {
          include: {
            profile: true,
          },
        },
      },
    })
    ;

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
  }
}

/**
 * DELETE /api/goals/[id]
 * Delete goal
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
    await prisma.goal.delete({
      where: { id },
    });

    return NextResponse.json(
      apiResponse({ message: 'Goal deleted successfully' }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Delete goal error:', error);
    return apiError('Failed to delete goal', 500);
  }
}
