import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// GET - Fetch all users
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        status: true,
        role: {
          select: {
            name: true,
            description: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// POST - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, password, roleId, departmentId } = body;

    // Validate required fields
    if (!email || !firstName || !lastName || !password || !roleId) {
      return NextResponse.json(
        { error: 'Missing required fields: email, firstName, lastName, password, roleId' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        roleId: typeof roleId === 'string' ? parseInt(roleId) : roleId,
        departmentId: departmentId || null,
        status: 'INVITED',
        profile: {
          create: {
            firstName,
            lastName,
          },
        },
      },
      select: {
        id: true,
        email: true,
        status: true,
        role: {
          select: {
            name: true,
          },
        },
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
