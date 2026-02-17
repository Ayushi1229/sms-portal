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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return apiError('Unauthorized', 401);
    }

    const { id } = await params;
    const mentor = await prisma.mentorProfile.findUnique({
      where: { userId: id },
      include: {
        user: {
          include: {
            profile: true,
            department: true,
            institution: true,
          },
        },
      },
    });

    if (!mentor) {
      return apiError('Mentor not found', 404);
    }

    // Get assignments count
    const assignmentsCount = await prisma.mentorAssignment.count({
      where: {
        mentorId: id,
        status: 'ACTIVE',
      },
    });

    // Get recent assignments
    const assignments = await prisma.mentorAssignment.findMany({
      where: {
        mentorId: id,
        status: 'ACTIVE',
      },
      include: {
        student: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
      take: 10,
    });

    return NextResponse.json(
      apiResponse({
        ...mentor,
        assignmentsCount,
        assignments,
      }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get mentor error:', error);
    return apiError('Failed to fetch mentor', 500);
  }
}

/**
 * PUT /api/mentors/[id]
 * Update mentor information
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
      firstName,
      lastName,
      phone,
      designation,
      specialization,
      maxMentees,
      availabilityStatus,
    } = body;

    // Update user profile and mentor profile
    const updatedMentor = await prisma.user.update({
      where: { id },
      data: {
        profile: {
          update: {
            firstName,
            lastName,
            phone,
          },
        },
        mentorProfile: {
          update: {
            designation,
            specialization,
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
  }
}

/**
 * DELETE /api/mentors/[id]
 * Delete mentor (soft delete)
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
    // Check if mentor has active assignments
    const activeAssignments = await prisma.mentorAssignment.count({
      where: {
        mentorId: id,
        status: 'ACTIVE',
      },
    });

    if (activeAssignments > 0) {
      return apiError('Cannot delete mentor with active assignments', 400);
    }

    // Soft delete
    await prisma.user.update({
      where: { id },
      data: { status: 'DISABLED' },
    });

    return NextResponse.json(
      apiResponse({ message: 'Mentor deleted successfully' }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Delete mentor error:', error);
    return apiError('Failed to delete mentor', 500);
  }
}
