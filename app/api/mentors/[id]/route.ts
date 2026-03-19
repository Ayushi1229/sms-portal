import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { canPerformAction, isAdmin, Role } from '@/lib/auth/permissions';
import { CoreApiError, requirePermission } from '@/lib/services/week8-core';

async function canAccessMentor(token: { id: string; roleId: number; departmentId: string | null }, mentorId: string): Promise<boolean> {
  if (token.id === mentorId) {
    return true;
  }

  if (isAdmin(token.roleId)) {
    if (!token.departmentId) {
      return true;
    }

    const sameDepartment = await prisma.user.findFirst({
      where: {
        id: mentorId,
        departmentId: token.departmentId,
      },
      select: { id: true },
    });

    return Boolean(sameDepartment);
  }

  if (token.roleId === Role.STUDENT) {
    const assignment = await prisma.mentorAssignment.findFirst({
      where: {
        mentorId,
        studentId: token.id,
        status: 'ACTIVE',
      },
      select: { id: true },
    });

    return Boolean(assignment);
  }

  return false;
}

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!(await canAccessMentor(token, id))) {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
    }

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
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });
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

    return NextResponse.json({ ...mentor, assignmentsCount, assignments }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Get mentor error:', error);
    return NextResponse.json({ error: 'Failed to fetch mentor' }, { status: 500 });
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canPerformAction(token.roleId, 'EDIT_MENTOR')) {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;

    if (!(await canAccessMentor(token, id))) {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
    }

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

    const normalizedMaxMentees = maxMentees !== undefined && maxMentees !== '' ? Number(maxMentees) : undefined;
    if (normalizedMaxMentees !== undefined && (!Number.isInteger(normalizedMaxMentees) || normalizedMaxMentees < 1 || normalizedMaxMentees > 200)) {
      return NextResponse.json({ error: 'maxMentees must be an integer between 1 and 200' }, { status: 400 });
    }

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
          upsert: {
            create: {
              designation,
              specialization,
              maxMentees: normalizedMaxMentees || 15,
              availabilityStatus: availabilityStatus || 'AVAILABLE',
            },
            update: {
            designation,
            specialization,
            maxMentees: normalizedMaxMentees,
            availabilityStatus,
            },
          },
        },
      },
      include: {
        profile: true,
        mentorProfile: true,
        department: true,
      },
    });

    return NextResponse.json({ mentor: updatedMentor, message: 'Mentor updated successfully' }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Update mentor error:', error);
    return NextResponse.json({ error: 'Failed to update mentor' }, { status: 500 });
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    requirePermission(token, 'EDIT_MENTOR');

    const { id } = await params;

    if (!(await canAccessMentor(token, id))) {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
    }

    const activeAssignments = await prisma.mentorAssignment.count({
      where: {
        mentorId: id,
        status: 'ACTIVE',
      },
    });

    if (activeAssignments > 0) {
      return NextResponse.json({ error: 'Cannot delete mentor with active assignments' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id },
      data: { status: 'DISABLED' },
    });

    return NextResponse.json({ message: 'Mentor deleted successfully' }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Delete mentor error:', error);
    return NextResponse.json({ error: 'Failed to delete mentor' }, { status: 500 });
  }
}
