import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { departmentId } = token;

    const [mentorsCount, studentsCount, alertsCount, goalsCount, sessionsCount, departmentName] = await Promise.all([
      prisma.user.count({ 
        where: { 
          role: { name: 'mentor' },
          ...(departmentId ? { departmentId } : {})
        } 
      }),
      prisma.user.count({ 
        where: { 
          role: { name: 'student' },
          ...(departmentId ? { departmentId } : {})
        } 
      }),
      prisma.alert.count({ 
        where: { 
          status: 'OPEN',
          ...(departmentId ? { student: { departmentId } } : {})
        } 
      }),
      prisma.goal.count({ 
        where: { 
          status: 'IN_PROGRESS',
          ...(departmentId ? { student: { departmentId } } : {})
        } 
      }),
      prisma.sessionRecord.count({
        where: {
          ...(departmentId ? { assignment: { departmentId } } : {})
        }
      }),
      departmentId ? prisma.department.findUnique({
        where: { id: departmentId },
        select: { name: true }
      }) : null
    ]);

    return NextResponse.json({
      mentors: mentorsCount,
      students: studentsCount,
      alerts: alertsCount,
      activeGoals: goalsCount,
      sessions: sessionsCount,
      departmentName: departmentName?.name || 'All Departments'
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
