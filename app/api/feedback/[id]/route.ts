import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const feedback = await prisma.sessionFeedback.findUnique({
      where: { id: params.id },
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
        },
        giver: { include: { profile: true } },
        recipient: { include: { profile: true } },
      }
    });

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { rating, comments, visibility } = body;

    const feedback = await prisma.sessionFeedback.update({
      where: { id: params.id },
      data: {
        rating: rating ? parseInt(rating) : undefined,
        comments,
        visibility,
      }
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.sessionFeedback.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 });
  }
}
