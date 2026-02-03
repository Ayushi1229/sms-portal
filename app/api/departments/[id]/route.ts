import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError } from '@/lib/api/response';
import { handleApiError } from '@/lib/api/error';

/**
 * GET /api/departments/[id]
 * Get a specific department by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        institution: true,
        users: {
          select: {
            id: true,
            email: true,
            profile: true,
            role: true,
          },
        },
      },
    });

    if (!department) {
      return NextResponse.json(
        apiError('Department not found', 404),
        { status: 404 }
      );
    }

    return NextResponse.json(apiResponse(department));
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/departments/[id]
 * Update a department
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, code } = body;

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      return NextResponse.json(
        apiError('Department not found', 404),
        { status: 404 }
      );
    }

    // Check if code is unique within institution if it's being changed
    if (code && code !== department.code) {
      const existingDept = await prisma.department.findFirst({
        where: {
          institutionId: department.institutionId,
          code,
          id: { not: id },
        },
      });

      if (existingDept) {
        return NextResponse.json(
          apiError('Department with this code already exists', 409),
          { status: 409 }
        );
      }
    }

    // Update department
    const updated = await prisma.department.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(code && { code }),
      },
      include: {
        institution: true,
        users: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
      },
    });

    return NextResponse.json(apiResponse(updated, 'Department updated successfully'));
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/departments/[id]
 * Delete a department
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });

    if (!department) {
      return NextResponse.json(
        apiError('Department not found', 404),
        { status: 404 }
      );
    }

    // Check if department has users
    if (department.users.length > 0) {
      return NextResponse.json(
        apiError(
          'Cannot delete department with active users. Please reassign users first.',
          400
        ),
        { status: 400 }
      );
    }

    // Delete department
    await prisma.department.delete({
      where: { id },
    });

    return NextResponse.json(apiResponse(null, 'Department deleted successfully'));
  } catch (error) {
    return handleApiError(error);
  }
}
