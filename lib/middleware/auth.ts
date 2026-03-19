import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export interface DecodedToken {
  id: string;
  email: string;
  roleId: number;
  departmentId: string | null;
  institutionId: string | null;
  iat: number;
  exp: number;
}

/**
 * Verifies JWT token from cookies (Edge Runtime compatible)
 */
export async function verifyToken(request: NextRequest): Promise<DecodedToken | null> {
  try {
    const token = request.cookies.get('accessToken')?.value;

    console.log("verifyToken - Cookie present:", !!token);
    
    if (!token) {
      console.log("verifyToken - No accessToken cookie found");
      return null;
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    const { payload } = await jwtVerify(token, secret);

    const id = typeof payload.id === 'string' ? payload.id : null;
    const email = typeof payload.email === 'string' ? payload.email : null;
    const roleIdValue = payload.roleId;
    const roleId =
      typeof roleIdValue === 'number'
        ? roleIdValue
        : typeof roleIdValue === 'string' && roleIdValue.trim() !== ''
          ? Number(roleIdValue)
          : NaN;
    const departmentIdRaw = payload.departmentId;
    const departmentId =
      departmentIdRaw === null || typeof departmentIdRaw === 'string'
        ? departmentIdRaw
        : null;
    
    const institutionIdRaw = payload.institutionId;
    const institutionId =
      institutionIdRaw === null || typeof institutionIdRaw === 'string'
        ? institutionIdRaw
        : null;
    const iat = typeof payload.iat === 'number' ? payload.iat : Math.floor(Date.now() / 1000);
    const exp = typeof payload.exp === 'number' ? payload.exp : iat;

    if (!id || !email || Number.isNaN(roleId)) {
      console.log('verifyToken - Missing required token claims');
      return null;
    }

    console.log('verifyToken - Token decoded successfully for user:', email);
    return {
      id,
      email,
      roleId,
      departmentId,
      institutionId,
      iat,
      exp,
    };
  } catch (error) {
    console.log("verifyToken - Token verification failed:", error);
    return null;
  }
}

/**
 * Middleware to protect API routes
 */
export function withAuth(handler: Function) {
  return async (request: NextRequest) => {
    const token = await verifyToken(request);

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

/**
 * Check if user has required role
 */
export function hasRole(userRoleId: number, allowedRoles: number[]): boolean {
  return allowedRoles.includes(userRoleId);
}

/**
 * Middleware to protect API routes with role checking
 */
export function withRoleAuth(allowedRoles: number[], handler: Function) {
  return async (request: NextRequest) => {
    const token = await verifyToken(request);

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    // Check if user has required role
    if (!hasRole(token.roleId, allowedRoles)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions', success: false },
        { status: 403 }
      );
    }

    // Add token to request for use in handler
    (request as any).user = token;
    return handler(request);
  };
}