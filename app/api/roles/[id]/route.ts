import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/middleware/auth';
import { Role as RoleEnum } from '@/lib/auth/permissions';
import { handleApiError } from '@/lib/api/error';

/**
 * PATCH /api/roles/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token || token.roleId !== RoleEnum.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized: Super Admin access required' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description } = body;

    const role = await prisma.role.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json(role);
  } catch (error) {
    return handleApiError(error, 'Failed to update role');
  }
}

/**
 * DELETE /api/roles/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token || token.roleId !== RoleEnum.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized: Super Admin access required' }, { status: 401 });
    }

    const { id } = await params;
    const roleId = parseInt(id);

    // Check if it's a system role (1-5)
    if (roleId <= 5) {
      return NextResponse.json({ error: 'Cannot delete system roles' }, { status: 400 });
    }

    // Check if role has users
    const usersCount = await prisma.user.count({
      where: { roleId },
    });

    if (usersCount > 0) {
      return NextResponse.json({ error: 'Cannot delete role with active users' }, { status: 400 });
    }

    await prisma.role.delete({
      where: { id: roleId },
    });

    return NextResponse.json({ message: 'Role deleted successfully' });
  } catch (error) {
    return handleApiError(error, 'Failed to delete role');
  }
}
