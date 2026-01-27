import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/middleware/auth';
import { apiResponse, apiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/goals
 * Get all goals with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    const token = verifyToken(request);
    if (!token) {
      return apiError('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const studentId = searchParams.get('studentId') || '';
    const mentorId = searchParams.get('mentorId') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (studentId) {
      where.studentId = studentId;
    }

    if (mentorId) {
      where.mentorId = mentorId;
    }

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    // Get goals with pagination
    const [goals, total] = await Promise.all([
      prisma.goal.findMany({
        where,
        skip,
        take: limit,
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
            take: 3,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.goal.count({ where }),
    ]);

    return NextResponse.json(
      apiResponse({
        goals,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get goals error:', error);
    return apiError('Failed to fetch goals', 500);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/goals
 * Create new goal
 */
export async function POST(request: NextRequest) {
  try {
    const token = verifyToken(request);
    if (!token) {
      return apiError('Unauthorized', 401);
    }

    const body = await request.json();
    const {
      studentId,
      mentorId,
      title,
      description,
      category,
      targetDate,
      metrics,
      milestones,
    } = body;

    // Validate required fields
    if (!studentId || !title || !category) {
      return apiError('Missing required fields', 400);
    }

    // Create goal
    const goal = await prisma.goal.create({
      data: {
        studentId,
        mentorId: mentorId || token.id,
        title,
        description,
        category,
        targetDate: targetDate ? new Date(targetDate) : null,
        metrics,
        milestones,
        status: 'IN_PROGRESS',
        progress: 0,
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
        goal,
        message: 'Goal created successfully',
      }),
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Create goal error:', error);
    return apiError('Failed to create goal', 500);
  } finally {
    await prisma.$disconnect();
  }
}