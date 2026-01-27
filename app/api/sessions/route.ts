import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/middleware/auth';
import { apiResponse, apiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/sessions
 * Get all sessions with pagination and filters
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
    const mentorId = searchParams.get('mentorId') || '';
    const studentId = searchParams.get('studentId') || '';
    const status = searchParams.get('status') || '';
    const mode = searchParams.get('mode') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (mentorId) {
      where.mentorId = mentorId;
    }

    if (studentId) {
      where.studentId = studentId;
    }

    if (status) {
      where.status = status;
    }

    if (mode) {
      where.mode = mode;
    }

    // Get sessions with pagination
    const [sessions, total] = await Promise.all([
      prisma.sessionRecord.findMany({
        where,
        skip,
        take: limit,
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
          feedback: true,
        },
        orderBy: { scheduledAt: 'desc' },
      }),
      prisma.sessionRecord.count({ where }),
    ]);

    return NextResponse.json(
      apiResponse({
        sessions,
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
    console.error('Get sessions error:', error);
    return apiError('Failed to fetch sessions', 500);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/sessions
 * Create new mentoring session
 */
export async function POST(request: NextRequest) {
  try {
    const token = verifyToken(request);
    if (!token) {
      return apiError('Unauthorized', 401);
    }

    const body = await request.json();
    const {
      mentorId,
      studentId,
      scheduledAt,
      duration,
      mode,
      location,
      agenda,
      meetingLink,
    } = body;

    // Validate required fields
    if (!mentorId || !studentId || !scheduledAt || !mode) {
      return apiError('Missing required fields', 400);
    }

    // Check if mentor exists and is available
    const mentor = await prisma.mentorProfile.findUnique({
      where: { userId: mentorId },
    });

    if (!mentor) {
      return apiError('Mentor not found', 404);
    }

    if (mentor.availabilityStatus !== 'AVAILABLE') {
      return apiError('Mentor is not available', 400);
    }

    // Check if student exists
    const student = await prisma.studentProfile.findUnique({
      where: { userId: studentId },
    });

    if (!student) {
      return apiError('Student not found', 404);
    }

    // Check for conflicting sessions
    const scheduledDate = new Date(scheduledAt);
    const endTime = new Date(scheduledDate.getTime() + (duration || 60) * 60000);

    const conflictingSessions = await prisma.sessionRecord.count({
      where: {
        OR: [
          { mentorId },
          { studentId },
        ],
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS'],
        },
        scheduledAt: {
          gte: scheduledDate,
          lt: endTime,
        },
      },
    });

    if (conflictingSessions > 0) {
      return apiError('Time slot conflicts with existing session', 409);
    }

    // Create session
    const session = await prisma.sessionRecord.create({
      data: {
        mentorId,
        studentId,
        scheduledAt: scheduledDate,
        duration: duration || 60,
        mode,
        location,
        agenda,
        meetingLink,
        status: 'SCHEDULED',
        attendance: 'PENDING',
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
        session,
        message: 'Session scheduled successfully',
      }),
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Create session error:', error);
    return apiError('Failed to create session', 500);
  } finally {
    await prisma.$disconnect();
  }
}