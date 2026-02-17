import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            users: true, // This will include all users (admins, mentors, students)
            mentorAssignments: true,
          }
        },
        users: {
          select: {
            role: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Format the data to match the component's expectations
    const formattedDepartments = departments.map(dept => {
      const mentors = dept.users.filter(u => u.role.name === 'mentor').length;
      const students = dept.users.filter(u => u.role.name === 'student').length;
      
      return {
        id: dept.id,
        code: dept.code,
        name: dept.name,
        mentors: mentors,
        students: students,
        status: 'Active', // Status is not explicitly in the schema, defaulting to Active
      };
    });

    return NextResponse.json(formattedDepartments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, institutionId } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: 'Missing required fields: name, code' },
        { status: 400 }
      );
    }

    // Get an institution ID if not provided
    let finalInstitutionId = institutionId;
    if (!finalInstitutionId) {
      const institution = await prisma.institution.findFirst();
      if (!institution) {
        return NextResponse.json(
          { error: 'No institution found. Please create an institution first.' },
          { status: 400 }
        );
      }
      finalInstitutionId = institution.id;
    }

    const department = await prisma.department.create({
      data: {
        name,
        code,
        institutionId: finalInstitutionId,
      },
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    );
  }
}
