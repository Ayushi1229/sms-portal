import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/middleware/auth';
import { apiResponse, apiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/mentors/[id]
 * Get single mentor by ID
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

    const mentor = await prisma.mentorProfile.findUnique({
      where: { userId: params.id },
      include: {
        user: {
          include: {
            profile: true,
            department: true,
            institution: true,
          },
        },
        assignments: {
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
          },
          where: {
            status: 'ACTIVE',
          },
          orderBy: { assignedAt: 'desc' },
        },
        sessions: {
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
          },
          orderBy: { scheduledAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            assignments: true,
            sessions: true,
          },
        },
      },
    });

    if (!mentor) {
      return apiError('Mentor not found', 404);
    }

    return NextResponse.json(
      apiResponse(mentor),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get mentor error:', error);
    return apiError('Failed to fetch mentor', 500);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PUT /api/mentors/[id]
 * Update mentor information
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
      firstName,
      lastName,
      phoneNumber,
      designation,
      qualification,
      specialization,
      experience,
      maxMentees,
      availabilityStatus,
    } = body;

    // Update user profile and mentor profile
    const updatedMentor = await prisma.user.update({
      where: { id: params.id },
      data: {
        profile: {
          update: {
            firstName,
            lastName,
            phoneNumber,
          },
        },
        mentorProfile: {
          update: {
            designation,
            qualification,
            specialization,
            experience: experience ? parseInt(experience) : undefined,
            maxMentees: maxMentees ? parseInt(maxMentees) : undefined,
            availabilityStatus,
          },
        },
      },
      include: {
        profile: true,
        mentorProfile: true,
        department: true,
      },
    });

    return NextResponse.json(
      apiResponse({
        mentor: updatedMentor,
        message: 'Mentor updated successfully',
      }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Update mentor error:', error);
    return apiError('Failed to update mentor', 500);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * DELETE /api/mentors/[id]
 * Delete mentor (soft delete)
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

    // Check if mentor has active assignments
    const activeAssignments = await prisma.mentorAssignment.count({
      where: {
        mentorId: params.id,
        status: 'ACTIVE',
      },
    });

    if (activeAssignments > 0) {
      return apiError('Cannot delete mentor with active assignments', 400);
    }

    // Soft delete
    await prisma.user.update({
      where: { id: params.id },
      data: { status: 'INACTIVE' },
    });

    return NextResponse.json(
      apiResponse({ message: 'Mentor deleted successfully' }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Delete mentor error:', error);
    return apiError('Failed to delete mentor', 500);
  } finally {
    await prisma.$disconnect();
  }
}