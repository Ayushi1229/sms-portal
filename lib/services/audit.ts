import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface AuditLogInput {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  beforeState?: any;
  afterState?: any;
  ip?: string;
  userAgent?: string;
}

/**
 * Creates an audit log entry
 */
export async function createAuditLog(input: AuditLogInput) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        beforeState: input.beforeState as Prisma.InputJsonValue,
        afterState: input.afterState as Prisma.InputJsonValue,
        ip: input.ip,
        userAgent: input.userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error to avoid breaking the main operation
  }
}
