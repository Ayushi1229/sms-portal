import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const session = await prisma.sessionRecord.findUnique({
      where: { id: sessionId },
      include: {
        assignment: true
      }
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({
      mentorId: session.assignment.mentorId,
      studentId: session.assignment.studentId
    });
  } catch (error: any) {
    console.error('Error in session-users api:', error);
    return NextResponse.json({ error: 'Failed to fetch session users' }, { status: 500 });
  }
}
