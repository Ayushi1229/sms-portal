import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/sessions
 */
export async function GET(request: NextRequest) {
  try {
    const sessions = await prisma.sessionRecord.findMany({
      include: {
        assignment: {
          include: {
            mentor: { include: { profile: true } },
            student: { include: { profile: true } }
          }
        },
        createdBy: { include: { profile: true } }
      },
      orderBy: { sessionDate: 'desc' },
    });

    const formattedSessions = sessions.map(s => ({
      id: s.id,
      mentor: `${s.assignment.mentor.profile?.firstName || ''} ${s.assignment.mentor.profile?.lastName || ''}`.trim(),
      student: `${s.assignment.student.profile?.firstName || ''} ${s.assignment.student.profile?.lastName || ''}`.trim(),
      date: s.sessionDate.toISOString().split('T')[0],
      time: s.sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: s.location || 'N/A',
      mode: s.mode,
      status: s.status,
      topic: s.topic,
    }));

    return NextResponse.json(formattedSessions);
  } catch (error: any) {
    console.error('Get sessions error:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

/**
 * POST /api/sessions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      assignmentId, 
      sessionDate, 
      mode, 
      location, 
      topic, 
      createdById 
    } = body;

    if (!assignmentId || !sessionDate || !mode || !topic || !createdById) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = await prisma.sessionRecord.create({
      data: {
        assignmentId,
        sessionDate: new Date(sessionDate),
        mode,
        location,
        topic,
        createdById,
        status: 'SCHEDULED',
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error: any) {
    console.error('Create session error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}