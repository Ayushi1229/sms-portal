import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validations/auth';
import { apiResponse, apiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/auth/register
 * Creates new user account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body against schema
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return apiError('An account with this email already exists', 409);
    }

    // Hash password (4 rounds - minimum for instant login performance)
    const passwordHash = await bcrypt.hash(validatedData.password, 4);

    // Create user with profile
    // SECURITY: Always assign new registrations as Student (roleId: 5)
    // Only super admins can change user roles
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        roleId: 5, // Always Student role - only super admins can change this
        departmentId: validatedData.departmentId || null,
        institutionId: validatedData.institutionId || null,
        status: 'ACTIVE',
        profile: {
          create: {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
          },
        },
      },
      include: {
        profile: true,
        role: true,
        department: true,
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      apiResponse({
        user: userWithoutPassword,
        message: 'Account created successfully',
      }),
      { status: 201 }
    );

  } catch (error: any) {
    if (error.name === 'ZodError') {
      // Format Zod validation errors for better user experience
      const fieldErrors = error.errors.map((err: any) => {
        const field = err.path.join('.');
        return `${field}: ${err.message}`;
      }).join(', ');
      
      return NextResponse.json(
        apiError(`Validation failed: ${fieldErrors}`, 400, error.errors),
        { status: 400 }
      );
    }
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        apiError('An account with this email already exists', 409),
        { status: 409 }
      );
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        apiError('Invalid role, department, or institution selected', 400),
        { status: 400 }
      );
    }
    
    console.error('Registration error:', error);
    const errorMessage = error.message || 'Registration failed. Please try again.';
    return NextResponse.json(
      apiError(errorMessage, 500),
      { status: 500 }
    );
  }
}