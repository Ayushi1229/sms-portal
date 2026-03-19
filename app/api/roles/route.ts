import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import { Role as RoleEnum } from '@/lib/auth/permissions';
import { handleApiError } from '@/lib/api/error';

/**
 * GET /api/roles
 */
export async function GET(request: NextRequest) {
  try {
    const roles = await prisma.role.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(roles);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch roles');
  }
}

/**
 * POST /api/roles
 */
export async function POST(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token || token.roleId !== RoleEnum.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized: Super Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
    }

    const role = await prisma.role.create({
      data: { name, description },
    });

    return NextResponse.json(role, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to create role');
  }
}
