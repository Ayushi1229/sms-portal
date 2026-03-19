import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import {
  CoreApiError,
  getFeedbackAccessWhere,
  isAdminUser,
  parseFeedbackVisibility,
} from '@/lib/services/week8-core';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const feedback = await prisma.sessionFeedback.findFirst({
      where: {
        id,
        ...getFeedbackAccessWhere(token),
      },
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
  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Error fetching feedback:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { rating, comments, visibility } = body;

    const existingFeedback = await prisma.sessionFeedback.findFirst({
      where: {
        id,
        ...getFeedbackAccessWhere(token),
      },
      select: {
        id: true,
        giverUserId: true,
      },
    });

    if (!existingFeedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    if (!isAdminUser(token) && existingFeedback.giverUserId !== token.id) {
      return NextResponse.json({ error: 'Forbidden: only feedback owner can edit' }, { status: 403 });
    }

    let normalizedRating: number | undefined;
    if (rating !== undefined) {
      normalizedRating = Number(rating);
      if (!Number.isInteger(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
        return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
      }
    }

    const normalizedVisibility = visibility ? parseFeedbackVisibility(visibility) : undefined;

    const feedback = await prisma.sessionFeedback.update({
      where: { id },
      data: {
        rating: normalizedRating,
        comments,
        visibility: normalizedVisibility,
      }
    });

    return NextResponse.json(feedback);
  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Error updating feedback:', error);
    return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existingFeedback = await prisma.sessionFeedback.findFirst({
      where: {
        id,
        ...getFeedbackAccessWhere(token),
      },
      select: {
        id: true,
        giverUserId: true,
      },
    });

    if (!existingFeedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    if (!isAdminUser(token) && existingFeedback.giverUserId !== token.id) {
      return NextResponse.json({ error: 'Forbidden: only feedback owner can delete' }, { status: 403 });
    }

    await prisma.sessionFeedback.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Feedback deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Error deleting feedback:', error);
    return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 });
  }
}
