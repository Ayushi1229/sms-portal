import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/middleware/auth';
import { apiResponse, apiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/mentors
 * Get all mentors with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    const token = verifyToken(request);
    if (!token) {
      return apiError('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const departmentId = searchParams.get('departmentId') || '';
    const availabilityStatus = searchParams.get('availabilityStatus') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.user = {
        profile: {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
          ],
        },
      };
    }

    if (departmentId) {
      where.user = { 
        ...where.user,
        departmentId 
      };
    }

    if (availabilityStatus) {
      where.availabilityStatus = availabilityStatus;
    }

    // Get mentors with pagination
    const [mentors, total] = await Promise.all([
      prisma.mentorProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            include: {
              profile: true,
              department: true,
            },
          },
          assignments: {
            include: {
              student: {
                include: {
                  user: {
                    include: {
                      profile: true,
                    },
                  },
                },
              },
            },
            where: {
              status: 'ACTIVE',
            },
          },
          _count: {
            select: {
              assignments: true,
              sessions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.mentorProfile.count({ where }),
    ]);

    return NextResponse.json(
      apiResponse({
        mentors,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get mentors error:', error);
    return apiError('Failed to fetch mentors', 500);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/mentors
 * Create new mentor
 */
export async function POST(request: NextRequest) {
  try {
    const token = verifyToken(request);
    if (!token) {
      return apiError('Unauthorized', 401);
    }

    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      departmentId,
      institutionId,
      employeeId,
      designation,
      qualification,
      specialization,
      experience,
      phoneNumber,
      maxMentees,
      availabilityStatus,
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !employeeId) {
      return apiError('Missing required fields', 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return apiError('User with this email already exists', 409);
    }

    // Check if employee ID exists
    const existingEmployee = await prisma.mentorProfile.findUnique({
      where: { employeeId },
    });

    if (existingEmployee) {
      return apiError('Employee ID already exists', 409);
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    // Get mentor role ID
    const mentorRole = await prisma.role.findFirst({
      where: { name: 'Mentor' },
    });

    if (!mentorRole) {
      return apiError('Mentor role not found', 500);
    }

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
            phoneNumber,
          },
        },
        mentorProfile: {
          create: {
            employeeId,
            designation,
            qualification,
            specialization,
            experience: experience ? parseInt(experience) : null,
            maxMentees: maxMentees ? parseInt(maxMentees) : 10,
            currentMentees: 0,
            availabilityStatus: availabilityStatus || 'AVAILABLE',
          },
        },
      },
      include: {
        profile: true,
        mentorProfile: true,
        department: true,
      },
    });

    const { passwordHash: _, ...mentorWithoutPassword } = mentor;

    return NextResponse.json(
      apiResponse({
        mentor: mentorWithoutPassword,
        message: 'Mentor created successfully',
      }),
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Create mentor error:', error);
    return apiError('Failed to create mentor', 500);
  } finally {
    await prisma.$disconnect();
  }
}