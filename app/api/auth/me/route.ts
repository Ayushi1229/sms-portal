import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/middleware/auth';
import { apiResponse, apiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/auth/me
 * Returns current authenticated user data
 */
export async function GET(request: NextRequest) {
  try {
    const token = verifyToken(request);

    if (!token) {
      return apiError('Unauthorized', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id },
      include: {
        role: true,
        department: true,
      },
    });

    if (!user) {
      return apiError('User not found', 404);
    }

    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(
      apiResponse(userWithoutPassword),
      { status: 200 }
    );

  } catch (error: any) {
    return apiError('An error occurred', 500);
  } finally {
    await prisma.$disconnect();
  }
}