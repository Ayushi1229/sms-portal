import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/middleware/auth';
import { apiResponse, apiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/students/[id]
 * Get single student by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = verifyToken(request);
    if (!token) {
      return apiError('Unauthorized', 401);
    }

    const { id } = await params;
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
      return apiError('Student not found', 404);
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

    return NextResponse.json(
      apiResponse({
        ...student,
        assignments,
        goals,
      }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get student error:', error);
    return apiError('Failed to fetch student', 500);
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
    const token = verifyToken(request);
    if (!token) {
      return apiError('Unauthorized', 401);
    }

    const { id } = await params;

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

    // Update user profile and student profile
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
          update: {
            rollNumber,
            program,
            yearOfStudy: yearOfStudy ? parseInt(yearOfStudy) : undefined,
            gpa: gpa ? parseFloat(gpa) : undefined,
            attendancePct: attendancePct ? parseFloat(attendancePct) : undefined,
            riskLevel,
          },
        },
      },
      include: {
        profile: true,
        studentProfile: true,
        department: true,
      },
    });

    return NextResponse.json(
      apiResponse({
        student: updatedStudent,
        message: 'Student updated successfully',
      }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Update student error:', error);
    return apiError('Failed to update student', 500);
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
    const token = verifyToken(request);
    if (!token) {
      return apiError('Unauthorized', 401);
    }

    const { id } = await params;
    // Soft delete - set status to DISABLED
    await prisma.user.update({
      where: { id },
      data: { status: 'DISABLED' },
    });

    return NextResponse.json(
      apiResponse({ message: 'Student deleted successfully' }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Delete student error:', error);
    return apiError('Failed to delete student', 500);
  }
}
