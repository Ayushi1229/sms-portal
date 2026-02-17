import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginSchema } from '@/lib/validations/auth';
import { apiResponse, apiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';


/**
 * POST /api/auth/login
 * Authenticates user with email and password
 * Returns JWT tokens and user data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body against schema
    const validatedData = loginSchema.parse(body);

    // Validate JWT secrets early to fail fast
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      console.error('JWT secrets not configured in environment variables');
      return NextResponse.json(
        apiError('Server configuration error. Please contact support.', 500),
        { status: 500 }
      );
    }

    // FAST MODE: Skip expensive operations in development for instant login
    const isFastMode = process.env.FAST_AUTH_MODE === 'true' && process.env.NODE_ENV === 'development';

    // Find user by email with minimal includes for speed
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        role: true,
        department: true,
        profile: true,
      },
    });

    // User not found
    if (!user) {
      return NextResponse.json(
        apiError('Invalid email or password', 401),
        { status: 401 }
      );
    }

    // Check if account is active
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        apiError('Your account has been deactivated. Please contact an administrator.', 403),
        { status: 403 }
      );
    }

    // Verify password (skip in fast mode for development)
    if (!isFastMode) {
      const isPasswordValid = await bcrypt.compare(
        validatedData.password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          apiError('Invalid email or password', 401),
          { status: 401 }
        );
      }
    }
    // In fast mode, trust the email alone for instant dev experience

    // Generate JWT tokens (do this in parallel wouldn't help since jwt.sign is synchronous)
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
        departmentId: user.departmentId,
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    // Create response with tokens in HttpOnly cookies
    const response = NextResponse.json(
      apiResponse({
        user: userWithoutPassword,
        message: 'Login successful',
      }),
      { status: 200 }
    );

    // Set HttpOnly cookies for security
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better redirect compatibility
      maxAge: 15 * 60,
      path: '/',
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better redirect compatibility
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    console.log("Login successful - cookies set for user:", user.email);
    console.log("User role:", user.roleId);

    return response;

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        apiError('Invalid input. Please check your email and password.', 400, error.errors),
        { status: 400 }
      );
    }
    console.error('Login error:', error);
    return NextResponse.json(
      apiError('An error occurred during login. Please try again.', 500),
      { status: 500 }
    );
  }
}