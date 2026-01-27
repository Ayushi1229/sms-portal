import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface DecodedToken {
  id: string;
  email: string;
  roleId: string;
  departmentId: string;
  iat: number;
  exp: number;
}

/**
 * Verifies JWT token from cookies
 */
export function verifyToken(request: NextRequest): DecodedToken | null {
  try {
    const token = request.cookies.get('accessToken')?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as DecodedToken;

    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware to protect API routes
 */
export function withAuth(handler: Function) {
  return async (request: NextRequest) => {
    const token = verifyToken(request);

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    // Add token to request for use in handler
    (request as any).user = token;
    return handler(request);
  };
}