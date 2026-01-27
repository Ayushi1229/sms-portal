import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { apiResponse, apiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/auth/register
 * Creates new user account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, roleId, departmentId, institutionId } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return apiError('Missing required fields', 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return apiError('User with this email already exists', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        roleId: roleId || 1, // Default role
        departmentId,
        institutionId,
        status: 'ACTIVE',
        profile: {
          create: {
            firstName,
            lastName,
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
        message: 'User registered successfully',
      }),
      { status: 201 }
    );

  } catch (error: any) {
    return apiError('Registration failed', 500);
  } finally {
    await prisma.$disconnect();
  }
}