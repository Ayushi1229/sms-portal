import { NextResponse } from 'next/server';
import { apiResponse } from '@/lib/api/response';

/**
 * POST /api/auth/logout
 * Clears authentication cookies
 */
export async function POST() {
  const response = NextResponse.json(
    apiResponse({ message: 'Logged out successfully' }),
    { status: 200 }
  );

  // Clear cookies
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');

  return response;
}