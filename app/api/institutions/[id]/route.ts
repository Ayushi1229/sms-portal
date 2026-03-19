import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/middleware/auth';
import { Role } from '@/lib/auth/permissions';
import { toErrorResponse } from '@/lib/api/error';

/**
 * GET /api/institutions/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token || token.roleId !== Role.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized: Super Admin access required' }, { status: 401 });
    }

    const { id } = await params;

    const institution = await prisma.institution.findUnique({
      where: { id },
      include: {
        departments: {
          include: {
            _count: {
              select: {
                users: true,
              }
            }
          }
        },
        _count: {
          select: {
            departments: true,
            users: true,
          }
        }
      }
    });

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    return NextResponse.json(institution);
  } catch (error: unknown) {
    return toErrorResponse(error, 'Failed to fetch institution detail');
  }
}

/**
 * PATCH /api/institutions/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token || token.roleId !== Role.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized: Super Admin access required' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, code, address, contactEmail } = body;

    const institution = await prisma.institution.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(address && { address }),
        ...(contactEmail && { contactEmail }),
      },
    });

    return NextResponse.json(institution);
  } catch (error: unknown) {
    return toErrorResponse(error, 'Failed to update institution');
  }
}

/**
 * DELETE /api/institutions/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token || token.roleId !== Role.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized: Super Admin access required' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.institution.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Institution deleted successfully' });
  } catch (error: unknown) {
    return toErrorResponse(error, 'Failed to delete institution');
  }
}
