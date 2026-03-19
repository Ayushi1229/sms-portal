import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/middleware/auth';
import { Prisma } from '@prisma/client';
import { toErrorResponse } from '@/lib/api/error';
import {
  CoreApiError,
  getGoalAccessWhere,
  normalizeDateInput,
  parseGoalCategory,
  requirePermission,
  validateGoalCreation,
} from '@/lib/services/week8-core';
import { paginatedResponse, parsePagination, shouldUsePagination } from '@/lib/api/pagination';
import { createGoalSchema, goalsListQuerySchema } from '@/lib/validations/week10';

/**
 * GET /api/goals
 */
export async function GET(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const validatedQuery = goalsListQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const search = validatedQuery.search || '';
    const status = validatedQuery.status || '';
    const category = validatedQuery.category || '';
    const shouldPaginate = shouldUsePagination(request);
    const { page, pageSize, skip } = parsePagination(request);

    const where: Prisma.GoalWhereInput = {
      ...getGoalAccessWhere(token),
      ...(status ? { status: status as any } : {}),
      ...(category ? { category: category as any } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { description: { contains: search } },
              { student: { profile: { firstName: { contains: search } } } },
              { student: { profile: { lastName: { contains: search } } } },
              { createdBy: { profile: { firstName: { contains: search } } } },
              { createdBy: { profile: { lastName: { contains: search } } } },
            ],
          }
        : {}),
    };

    const [goals, total] = await Promise.all([
      prisma.goal.findMany({
      where,
      include: {
        student: { include: { profile: true } },
        createdBy: { include: { profile: true } }
      },
      orderBy: { createdAt: 'desc' },
      ...(shouldPaginate ? { skip, take: pageSize } : {}),
    }),
      shouldPaginate ? prisma.goal.count({ where }) : Promise.resolve(0),
    ]);

    const formattedGoals = goals.map(g => ({
      id: g.id,
      student: `${g.student.profile?.firstName || ''} ${g.student.profile?.lastName || ''}`.trim(),
      mentor: `${g.createdBy.profile?.firstName || ''} ${g.createdBy.profile?.lastName || ''}`.trim(),
      title: g.title,
      category: g.category,
      progress: g.progressPct,
      status: g.status,
      targetDate: g.targetDate ? g.targetDate.toISOString().split('T')[0] : 'N/A',
    }));

    if (shouldPaginate) {
      return NextResponse.json(paginatedResponse(formattedGoals, total, page, pageSize));
    }

    return NextResponse.json(formattedGoals);
  } catch (error: unknown) {
    if (error instanceof CoreApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    return toErrorResponse(error, 'Failed to fetch goals');
  }
}

/**
 * POST /api/goals
 */
export async function POST(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    requirePermission(token, 'CREATE_GOAL');

    const body = await request.json();
    const {
      studentId,
      title,
      category,
      description,
      targetDate,
      createdById,
    } = createGoalSchema.parse(body);

    await validateGoalCreation({
      studentId,
      requester: token,
    });

    const parsedCategory = parseGoalCategory(category);

    const goal = await prisma.goal.create({
      data: {
        studentId,
        title: title.trim(),
        category: parsedCategory,
        description,
        targetDate: targetDate ? normalizeDateInput(targetDate) : null,
        createdById: createdById && createdById === token.id ? createdById : token.id,
        status: 'NOT_STARTED',
        progressPct: 0,
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof CoreApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    return toErrorResponse(error, 'Failed to create goal');
  }
}