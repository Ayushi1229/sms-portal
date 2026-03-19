import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import { apiResponse, apiErrorResponse } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/auth/me
 * Returns current authenticated user data
 */
export async function GET(request: NextRequest) {
  try {
    const token = await verifyToken(request);

    if (!token) {
      return apiErrorResponse('Unauthorized', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id },
      include: {
        role: true,
        department: true,
        profile: true,
        mentorProfile: true,
        studentProfile: true,
      },
    });

    if (!user) {
      return apiErrorResponse('User not found', 404);
    }

    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json(
      apiResponse(userWithoutPassword),
      { status: 200 }
    );

  } catch (error: any) {
    return apiErrorResponse('An error occurred', 500);
  }
}