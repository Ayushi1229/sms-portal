import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/mentors
 * Get all mentors
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const departmentId = searchParams.get('departmentId') || '';
    const availabilityStatus = searchParams.get('availabilityStatus') || '';

    // Get mentors by querying Users with role 'mentor'
    const mentors = await prisma.user.findMany({
      where: {
        role: { name: 'mentor' },
        ...(departmentId && { departmentId }),
        ...(search && {
          profile: {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
            ],
          },
        }),
      },
      include: {
        profile: true,
        department: true,
        mentorProfile: true, // This might be null for older users
        _count: {
          select: {
            mentorAssignments: {
              where: { status: 'ACTIVE' }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format for the frontend
    const formattedMentors = mentors.map(user => {
      const m = user.mentorProfile;
      const activeMentees = user._count?.mentorAssignments || 0;
      const maxMentees = m?.maxMentees || 15;
      
      return {
        id: user.id,
        name: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim(),
        email: user.email,
        department: user.department?.name || 'N/A',
        specialization: m?.specialization || 'General',
        capacity: `${activeMentees}/${maxMentees} Students`,
        status: m?.availabilityStatus || 'AVAILABLE',
        rating: 4.5,
      };
    });

    return NextResponse.json(formattedMentors);
  } catch (error: any) {
    console.error('Get mentors error:', error);
    return NextResponse.json({ error: 'Failed to fetch mentors' }, { status: 500 });
  }
}

/**
 * POST /api/mentors
 * Create new mentor
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      departmentId,
      institutionId,
      designation,
      specialization,
      maxMentees,
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the mentor role
    const mentorRole = await prisma.role.findUnique({
      where: { name: 'mentor' }
    });

    if (!mentorRole) {
      return NextResponse.json({ error: 'Mentor role not found' }, { status: 500 });
    }

    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with mentor profile
    const mentor = await prisma.user.create({
      data: {
        email,
        passwordHash,
        roleId: mentorRole.id,
        departmentId,
        institutionId,
        status: 'ACTIVE',
        profile: {
          create: {
            firstName,
            lastName,
          },
        },
        mentorProfile: {
          create: {
            designation,
            specialization,
            maxMentees: maxMentees ? parseInt(maxMentees) : 15,
            availabilityStatus: 'AVAILABLE',
          },
        },
      },
    });

    return NextResponse.json(mentor, { status: 201 });
  } catch (error: any) {
    console.error('Create mentor error:', error);
    return NextResponse.json({ error: 'Failed to create mentor' }, { status: 500 });
  }
}