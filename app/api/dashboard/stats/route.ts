import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const [mentorsCount, studentsCount, alertsCount, goalsCount] = await Promise.all([
      prisma.user.count({ where: { role: { name: 'mentor' } } }),
      prisma.user.count({ where: { role: { name: 'student' } } }),
      prisma.alert.count({ where: { status: 'OPEN' } }),
      prisma.goal.count({ where: { status: 'IN_PROGRESS' } }),
    ]);

    return NextResponse.json({
      mentors: mentorsCount,
      students: studentsCount,
      alerts: alertsCount,
      activeGoals: goalsCount,
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
