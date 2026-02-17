import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const feedback = await prisma.sessionFeedback.findMany({
      include: {
        session: {
          include: {
            assignment: {
              include: {
                mentor: { include: { profile: true } },
                student: { include: { profile: true } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedFeedback = feedback.map(f => ({
      id: f.id,
      mentor: `${f.session.assignment.mentor.profile?.firstName || ''} ${f.session.assignment.mentor.profile?.lastName || ''}`.trim(),
      student: `${f.session.assignment.student.profile?.firstName || ''} ${f.session.assignment.student.profile?.lastName || ''}`.trim(),
      date: f.createdAt.toISOString().split('T')[0],
      rating: f.rating,
      category: f.type === 'MENTOR_TO_STUDENT' ? 'Mentor Feedback' : 'Student Feedback',
      status: 'Completed',
    }));

    return NextResponse.json(formattedFeedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      sessionId, 
      giverUserId, 
      recipientUserId, 
      type, 
      rating, 
      comments,
      visibility
    } = body;

    if (!sessionId || !giverUserId || !recipientUserId || !type || rating === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [feedback] = await prisma.$transaction([
      prisma.sessionFeedback.create({
        data: {
          sessionId,
          giverUserId,
          recipientUserId,
          type,
          rating: parseInt(rating),
          comments,
          visibility: visibility || (type === 'MENTOR_TO_STUDENT' ? 'STUDENT' : 'MENTOR'),
        }
      }),
      prisma.sessionRecord.update({
        where: { id: sessionId },
        data: { status: 'COMPLETED' }
      })
    ]);

    return NextResponse.json(feedback, { status: 201 });
  } catch (error: any) {
    console.error('Create feedback error:', error);
    return NextResponse.json({ error: 'Failed to create feedback' }, { status: 500 });
  }
}
