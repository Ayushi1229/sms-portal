import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/goals
 */
export async function GET(request: NextRequest) {
  try {
    const goals = await prisma.goal.findMany({
      include: {
        student: { include: { profile: true } },
        createdBy: { include: { profile: true } }
      },
      orderBy: { createdAt: 'desc' },
    });

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

    return NextResponse.json(formattedGoals);
  } catch (error: any) {
    console.error('Get goals error:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

/**
 * POST /api/goals
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      studentId, 
      title, 
      category, 
      description, 
      targetDate, 
      createdById 
    } = body;

    if (!studentId || !title || !category || !createdById) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const goal = await prisma.goal.create({
      data: {
        studentId,
        title,
        category,
        description,
        targetDate: targetDate ? new Date(targetDate) : null,
        createdById,
        status: 'NOT_STARTED',
        progressPct: 0,
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error: any) {
    console.error('Create goal error:', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}