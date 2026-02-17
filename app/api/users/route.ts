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
    const { email, firstName, lastName, password, roleId, departmentId, status } = body;

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

    // Get the institution ID (use first institution if available)
    const institution = await prisma.institution.findFirst();

    // Get the role to check if it's a mentor or student
    const role = await prisma.role.findUnique({
      where: { id: typeof roleId === 'string' ? parseInt(roleId) : roleId },
    });

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        roleId: role.id,
        departmentId: departmentId || null,
        institutionId: institution?.id || null,
        status: status || 'ACTIVE',
        profile: {
          create: {
            firstName,
            lastName,
          },
        },
        // Automatically create Mentor or Student profiles if applicable
        ...(role.name === 'mentor' && {
          mentorProfile: {
            create: {
              specialization: 'General',
              availabilityStatus: 'AVAILABLE',
            }
          }
        }),
        ...(role.name === 'student' && {
          studentProfile: {
            create: {
              rollNumber: `TEMP-${Date.now()}`, // Generate a temporary roll number
              riskLevel: 'LOW',
            }
          }
        }),
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
