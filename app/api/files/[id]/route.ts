import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/middleware/auth';
import { isAdmin } from '@/lib/auth/permissions';
import { toErrorResponse } from '@/lib/api/error';

export const runtime = 'nodejs';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const file = await prisma.attachment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            departmentId: true,
          },
        },
      },
    });

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const isOwner = file.userId === token.id;
    const isPrivileged =
      isAdmin(token.roleId) &&
      (!token.departmentId || file.user?.departmentId === token.departmentId);

    if (!isOwner && !isPrivileged) {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
    }

    await prisma.attachment.delete({ where: { id } });

    if (file.url.startsWith('/uploads/')) {
      const diskPath = path.join(process.cwd(), 'public', file.url.replace(/^\//, ''));
      await unlink(diskPath).catch(() => undefined);
    }

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    return toErrorResponse(error, 'Failed to delete file');
  }
}