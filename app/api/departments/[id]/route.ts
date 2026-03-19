import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError } from '@/lib/api/response';
import { handleApiError } from '@/lib/api/error';
import { verifyToken } from '@/lib/middleware/auth';
import { canPerformAction, Role } from '@/lib/auth/permissions';

/**
 * GET /api/departments/[id]
 * Get a specific department by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json(apiError('Unauthorized', 401), { status: 401 });
    }

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

    const canView =
      token.roleId === Role.SUPER_ADMIN ||
      token.roleId === Role.INSTITUTIONAL_ADMIN ||
      token.departmentId === id;

    if (!canView) {
      return NextResponse.json(apiError('Forbidden: insufficient permissions', 403), { status: 403 });
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
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json(apiError('Unauthorized', 401), { status: 401 });
    }

    if (!canPerformAction(token.roleId, 'MANAGE_DEPARTMENTS')) {
      return NextResponse.json(apiError('Forbidden: insufficient permissions', 403), { status: 403 });
    }

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
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json(apiError('Unauthorized', 401), { status: 401 });
    }

    if (!canPerformAction(token.roleId, 'MANAGE_DEPARTMENTS')) {
      return NextResponse.json(apiError('Forbidden: insufficient permissions', 403), { status: 403 });
    }

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
