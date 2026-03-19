import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { canPerformAction, isAdmin, Role } from '@/lib/auth/permissions';
import { CoreApiError, requirePermission } from '@/lib/services/week8-core';

async function canAccessStudent(token: { id: string; roleId: number; departmentId: string | null }, studentId: string): Promise<boolean> {
  if (token.id === studentId) {
    return true;
  }

  if (isAdmin(token.roleId)) {
    if (!token.departmentId) {
      return true;
    }

    const sameDepartment = await prisma.user.findFirst({
      where: {
        id: studentId,
        departmentId: token.departmentId,
      },
      select: { id: true },
    });

    return Boolean(sameDepartment);
  }

  if (token.roleId === Role.MENTOR) {
    const assignment = await prisma.mentorAssignment.findFirst({
      where: {
        mentorId: token.id,
        studentId,
        status: 'ACTIVE',
      },
      select: { id: true },
    });

    return Boolean(assignment);
  }

  return false;
}

/**
 * GET /api/students/[id]
 * Get single student by ID
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

    if (!(await canAccessStudent(token, id))) {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
    }

    const student = await prisma.studentProfile.findUnique({
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

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get assignments
    const assignments = await prisma.mentorAssignment.findMany({
      where: {
        studentId: id,
      },
      include: {
        mentor: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
      take: 5,
    });

    // Get goals
    const goals = await prisma.goal.findMany({
      where: {
        studentId: id,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({ ...student, assignments, goals }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Get student error:', error);
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
  }
}

/**
 * PUT /api/students/[id]
 * Update student information
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

    requirePermission(token, 'EDIT_STUDENT');

    const { id } = await params;

    if (!(await canAccessStudent(token, id))) {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      phone,
      rollNumber,
      program,
      yearOfStudy,
      gpa,
      attendancePct,
      riskLevel,
    } = body;

    const normalizedYear = yearOfStudy !== undefined && yearOfStudy !== '' ? Number(yearOfStudy) : undefined;
    const normalizedGpa = gpa !== undefined && gpa !== '' ? Number(gpa) : undefined;
    const normalizedAttendance = attendancePct !== undefined && attendancePct !== '' ? Number(attendancePct) : undefined;

    if (normalizedYear !== undefined && (!Number.isInteger(normalizedYear) || normalizedYear < 1 || normalizedYear > 10)) {
      return NextResponse.json({ error: 'yearOfStudy must be an integer between 1 and 10' }, { status: 400 });
    }

    if (normalizedGpa !== undefined && (Number.isNaN(normalizedGpa) || normalizedGpa < 0 || normalizedGpa > 10)) {
      return NextResponse.json({ error: 'gpa must be between 0 and 10' }, { status: 400 });
    }

    if (normalizedAttendance !== undefined && (Number.isNaN(normalizedAttendance) || normalizedAttendance < 0 || normalizedAttendance > 100)) {
      return NextResponse.json({ error: 'attendancePct must be between 0 and 100' }, { status: 400 });
    }

    const updatedStudent = await prisma.user.update({
      where: { id },
      data: {
        profile: {
          update: {
            firstName,
            lastName,
            phone,
          },
        },
        studentProfile: {
          upsert: {
            create: {
              rollNumber: rollNumber || `TEMP-${id.substring(0, 6)}`,
              program,
              yearOfStudy: normalizedYear,
              gpa: normalizedGpa,
              attendancePct: normalizedAttendance,
              riskLevel: riskLevel || 'LOW',
            },
            update: {
            rollNumber,
            program,
            yearOfStudy: normalizedYear,
            gpa: normalizedGpa,
            attendancePct: normalizedAttendance,
            riskLevel,
            },
          },
        },
      },
      include: {
        profile: true,
        studentProfile: true,
        department: true,
      },
    });

    return NextResponse.json({ student: updatedStudent, message: 'Student updated successfully' }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Update student error:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

/**
 * DELETE /api/students/[id]
 * Delete student (soft delete by setting status to DISABLED)
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

    requirePermission(token, 'EDIT_STUDENT');

    const { id } = await params;

    if (!(await canAccessStudent(token, id))) {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
    }

    const activeAssignments = await prisma.mentorAssignment.count({
      where: {
        studentId: id,
        status: 'ACTIVE',
      },
    });

    if (activeAssignments > 0) {
      return NextResponse.json({ error: 'Cannot disable student with active assignments' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id },
      data: { status: 'DISABLED' },
    });

    return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Delete student error:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
