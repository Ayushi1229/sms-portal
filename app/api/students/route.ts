import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/middleware/auth';
import { apiResponse, apiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/students
 * Get all students with pagination and filters
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
    const riskLevel = searchParams.get('riskLevel') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { enrollmentNumber: { contains: search } },
        { user: { 
          profile: { 
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } }
            ]
          }
        }},
      ];
    }

    if (departmentId) {
      where.user = { departmentId };
    }

    if (riskLevel) {
      where.riskLevel = riskLevel;
    }

    // Get students with pagination
    const [students, total] = await Promise.all([
      prisma.studentProfile.findMany({
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
          mentor: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.studentProfile.count({ where }),
    ]);

    return NextResponse.json(
      apiResponse({
        students,
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
    console.error('Get students error:', error);
    return apiError('Failed to fetch students', 500);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/students
 * Create new student
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
      enrollmentNumber,
      batch,
      semester,
      cgpa,
      phoneNumber,
      guardianName,
      guardianContact,
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !enrollmentNumber) {
      return apiError('Missing required fields', 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return apiError('User with this email already exists', 409);
    }

    // Check if enrollment number exists
    const existingEnrollment = await prisma.studentProfile.findUnique({
      where: { enrollmentNumber },
    });

    if (existingEnrollment) {
      return apiError('Enrollment number already exists', 409);
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    // Get student role ID (assuming roleId 3 is for students)
    const studentRole = await prisma.role.findFirst({
      where: { name: 'Student' },
    });

    if (!studentRole) {
      return apiError('Student role not found', 500);
    }

    // Create user with student profile
    const student = await prisma.user.create({
      data: {
        email,
        passwordHash,
        roleId: studentRole.id,
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
        studentProfile: {
          create: {
            enrollmentNumber,
            batch,
            semester,
            cgpa: cgpa ? parseFloat(cgpa) : null,
            guardianName,
            guardianContact,
            riskLevel: 'LOW',
          },
        },
      },
      include: {
        profile: true,
        studentProfile: true,
        department: true,
      },
    });

    const { passwordHash: _, ...studentWithoutPassword } = student;

    return NextResponse.json(
      apiResponse({
        student: studentWithoutPassword,
        message: 'Student created successfully',
      }),
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Create student error:', error);
    return apiError('Failed to create student', 500);
  } finally {
    await prisma.$disconnect();
  }
}