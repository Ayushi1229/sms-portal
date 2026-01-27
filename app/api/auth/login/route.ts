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

    // Find user by email with role and department
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
      return apiError('Invalid email or password', 401);
    }

    // Check if account is active
    if (user.status !== 'ACTIVE') {
      return apiError('Your account has been deactivated', 403);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return apiError('Invalid email or password', 401);
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
        departmentId: user.departmentId,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
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
      sameSite: 'strict',
      maxAge: 15 * 60,
      path: '/',
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return apiError('Validation failed', 400, error.errors);
    }
    console.error('Login error:', error);
    return apiError('An error occurred during login', 500);
  } finally {
    await prisma.$disconnect();
  }
}