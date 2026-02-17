import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/alerts
 */
export async function GET(request: NextRequest) {
  try {
    const alerts = await prisma.alert.findMany({
      include: {
        student: { include: { profile: true } }
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedAlerts = alerts.map(a => ({
      id: a.id,
      student: `${a.student.profile?.firstName || ''} ${a.student.profile?.lastName || ''}`.trim(),
      type: a.category,
      severity: a.severity === 'CRITICAL' ? 'High' : a.severity === 'WARN' ? 'Medium' : 'Low',
      message: a.message,
      createdAt: a.createdAt.toISOString().split('T')[0],
      status: a.status === 'OPEN' ? 'Open' : 'Resolved',
    }));

    return NextResponse.json(formattedAlerts);
  } catch (error: any) {
    console.error('Get alerts error:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

/**
 * POST /api/alerts
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, severity, category, message } = body;

    if (!studentId || !severity || !category || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const alert = await prisma.alert.create({
      data: {
        studentId,
        severity,
        category,
        message,
        status: 'OPEN',
      },
    });

    return NextResponse.json(alert, { status: 201 });
  } catch (error: any) {
    console.error('Create alert error:', error);
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
  }
}
