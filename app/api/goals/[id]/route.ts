import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import {
  CoreApiError,
  getGoalAccessWhere,
  normalizeDateInput,
  parseGoalCategory,
  parseGoalStatus,
  requirePermission,
} from '@/lib/services/week8-core';
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const goal = await prisma.goal.findFirst({
      where: {
        id,
        ...getGoalAccessWhere(token),
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
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json(goal, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Get goal error:', error);
    return NextResponse.json({ error: 'Failed to fetch goal' }, { status: 500 });
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    requirePermission(token, 'EDIT_GOAL');

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

    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        ...getGoalAccessWhere(token),
      },
      select: { id: true },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    if (title !== undefined && typeof title === 'string' && title.trim().length < 3) {
      return NextResponse.json({ error: 'Title must be at least 3 characters long' }, { status: 400 });
    }

    if (progressPct !== undefined && (typeof progressPct !== 'number' || progressPct < 0 || progressPct > 100)) {
      return NextResponse.json({ error: 'Progress must be between 0 and 100' }, { status: 400 });
    }

    const normalizedCategory = category ? parseGoalCategory(category) : undefined;
    const normalizedStatus = status ? parseGoalStatus(status) : undefined;

    const resolvedStatus =
      normalizedStatus ?? (progressPct === 100 ? 'COMPLETED' : undefined);
    const resolvedProgress =
      resolvedStatus === 'COMPLETED'
        ? 100
        : progressPct !== undefined
          ? progressPct
          : undefined;

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        title: title !== undefined ? String(title).trim() : undefined,
        description,
        category: normalizedCategory,
        targetDate: targetDate ? normalizeDateInput(targetDate) : undefined,
        status: resolvedStatus,
        progressPct: resolvedProgress,
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

    return NextResponse.json({
      goal: updatedGoal,
      message: 'Goal updated successfully',
    }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Update goal error:', error);
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    requirePermission(token, 'EDIT_GOAL');

    const { id } = await params;

    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        ...getGoalAccessWhere(token),
      },
      select: { id: true },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    await prisma.goal.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Goal deleted successfully' }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Delete goal error:', error);
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
  }
}
