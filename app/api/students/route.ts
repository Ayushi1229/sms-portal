import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/students
 * Get all students
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const departmentId = searchParams.get('departmentId') || '';
    const riskLevel = searchParams.get('riskLevel') || '';

    // Get students by querying Users with role 'student'
    const students = await prisma.user.findMany({
      where: {
        role: { name: 'student' },
        ...(departmentId && { departmentId }),
        ...(search && {
          OR: [
            { email: { contains: search } },
            { profile: {
                OR: [
                  { firstName: { contains: search } },
                  { lastName: { contains: search } },
                ],
              }
            },
            { studentProfile: { rollNumber: { contains: search } } }
          ]
        }),
      },
      include: {
        profile: true,
        department: true,
        studentProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format for the frontend
    const formattedStudents = students.map(user => {
      const s = user.studentProfile;
      return {
        id: user.id,
        name: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim(),
        enrollmentNumber: s?.rollNumber || `TBD-${user.id.substring(0, 4)}`,
        email: user.email,
        department: user.department?.name || 'N/A',
        mentor: 'Not Assigned',
        status: user.status,
        riskLevel: s?.riskLevel || 'LOW',
        cgpa: s?.gpa ? parseFloat(s.gpa.toString()) : 0,
      };
    });

    return NextResponse.json(formattedStudents);
  } catch (error: any) {
    console.error('Get students error:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

/**
 * POST /api/students
 * Create new student
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
      rollNumber,
      program,
      yearOfStudy,
      gpa,
      attendancePct,
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !rollNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the student role
    const studentRole = await prisma.role.findUnique({
      where: { name: 'student' }
    });

    if (!studentRole) {
      return NextResponse.json({ error: 'Student role not found' }, { status: 500 });
    }

    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

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
          },
        },
        studentProfile: {
          create: {
            rollNumber,
            program,
            yearOfStudy: yearOfStudy ? parseInt(yearOfStudy) : null,
            gpa: gpa ? parseFloat(gpa) : null,
            attendancePct: attendancePct ? parseFloat(attendancePct) : null,
            riskLevel: 'LOW',
          },
        },
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error('Create student error:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}