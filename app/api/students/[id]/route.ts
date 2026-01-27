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
  { params }: { params: { id: string } }
) {
  try {
    const token = verifyToken(request);
    if (!token) {
      return apiError('Unauthorized', 401);
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: params.id },
      include: {
        user: {
          include: {
            profile: true,
            department: true,
            institution: true,
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
        assignments: {
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
          },
          orderBy: { assignedAt: 'desc' },
          take: 5,
        },
        goals: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!student) {
      return apiError('Student not found', 404);
    }

    return NextResponse.json(
      apiResponse(student),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get student error:', error);
    return apiError('Failed to fetch student', 500);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PUT /api/students/[id]
 * Update student information
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
      batch,
      semester,
      cgpa,
      guardianName,
      guardianContact,
      riskLevel,
    } = body;

    // Update user profile and student profile
    const updatedStudent = await prisma.user.update({
      where: { id: params.id },
      data: {
        profile: {
          update: {
            firstName,
            lastName,
            phoneNumber,
          },
        },
        studentProfile: {
          update: {
            batch,
            semester,
            cgpa: cgpa ? parseFloat(cgpa) : undefined,
            guardianName,
            guardianContact,
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
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * DELETE /api/students/[id]
 * Delete student (soft delete by setting status to INACTIVE)
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

    // Soft delete - set status to INACTIVE
    await prisma.user.update({
      where: { id: params.id },
      data: { status: 'INACTIVE' },
    });

    return NextResponse.json(
      apiResponse({ message: 'Student deleted successfully' }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Delete student error:', error);
    return apiError('Failed to delete student', 500);
  } finally {
    await prisma.$disconnect();
  }
}