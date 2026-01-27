import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { apiResponse, apiError } from '@/lib/api/response';

/**
 * POST /api/auth/refresh
 * Refreshes expired access token using refresh token
 */
export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return apiError('Refresh token not found', 401);
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
    ) as { id: string };

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '15m' }
    );

    const response = NextResponse.json(
      apiResponse({ message: 'Token refreshed successfully' }),
      { status: 200 }
    );

    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60,
      path: '/',
    });

    return response;

  } catch (error: any) {
    return apiError('Invalid or expired refresh token', 401);
  }
}