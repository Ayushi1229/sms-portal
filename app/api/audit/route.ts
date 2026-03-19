import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/middleware/auth';
import { Prisma } from '@prisma/client';
import { toErrorResponse } from '@/lib/api/error';
import { parsePagination, paginatedResponse, shouldUsePagination } from '@/lib/api/pagination';

/**
 * GET /api/audit
 */
export async function GET(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can view audit logs
    if (![1, 2, 3].includes(token.roleId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const action = searchParams.get('action') || '';
    const severity = searchParams.get('severity') || '';
    const shouldPaginate = shouldUsePagination(request);
    const { page, pageSize, skip } = parsePagination(request);

    const where: Prisma.AuditLogWhereInput = {
      ...(action ? { action } : {}),
      ...(search
        ? {
            OR: [
              { user: { email: { contains: search } } },
              { entity: { contains: search } },
              { action: { contains: search } },
            ],
          }
        : {}),
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        ...(shouldPaginate ? { skip, take: pageSize } : {}),
      }),
      prisma.auditLog.count({ where }),
    ]);

    const formattedLogs = logs.map(log => ({
      id: log.id.toString(), // BigInt needs to be stringified
      timestamp: log.createdAt.toISOString().replace('T', ' ').split('.')[0],
      user: log.user?.email || 'System',
      action: log.action,
      resource: `${log.entity}${log.entityId ? ': ' + log.entityId : ''}`,
      status: 'Success', // We don't store status yet, assuming success for now
      severity: 'low', // We don't store severity yet
    }));

    if (shouldPaginate) {
      return NextResponse.json(paginatedResponse(formattedLogs, total, page, pageSize));
    }

    return NextResponse.json(formattedLogs);
  } catch (error: unknown) {
    return toErrorResponse(error, 'Failed to fetch audit logs');
  }
}
