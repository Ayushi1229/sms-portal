import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import { Role } from '@/lib/auth/permissions';
import { handleApiError } from '@/lib/api/error';

/**
 * GET /api/departments
 */
export async function GET(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Filter by institution if not super admin
    const where = token.roleId !== Role.SUPER_ADMIN 
      ? { institutionId: token.institutionId || undefined }
      : {};

    const departments = await prisma.department.findMany({
      where,
      include: {
        institution: true,
        _count: {
          select: {
            users: true,
          }
        },
        users: {
          select: {
            roleId: true
          }
        }
      },
      orderBy: {
        name: 'asc',
      },
    });

    const formattedDepartments = departments.map((dept: any) => {
      const mentors = dept.users.filter((u: any) => u.roleId === Role.MENTOR).length;
      const students = dept.users.filter((u: any) => u.roleId === Role.STUDENT) .length;
      
      return {
        id: dept.id,
        code: dept.code,
        name: dept.name,
        institutionName: dept.institution.name,
        mentors: mentors,
        students: students,
        totalMembers: dept._count.users,
        status: 'Active',
      };
    });

    return NextResponse.json(formattedDepartments);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch departments');
  }
}

/**
 * POST /api/departments
 */
export async function POST(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token || (token.roleId !== Role.SUPER_ADMIN && token.roleId !== Role.INSTITUTIONAL_ADMIN)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, institutionId } = body;

    if (!name || !code) {
      return NextResponse.json({ error: 'Missing required fields: name, code' }, { status: 400 });
    }

    // Determine final institution ID
    let finalInstitutionId = token.roleId === Role.SUPER_ADMIN ? institutionId : token.institutionId;

    if (!finalInstitutionId && token.roleId === Role.SUPER_ADMIN) {
      // For Super Admin, if no ID provided, try to find first institution
      const inst = await prisma.institution.findFirst();
      if (!inst) throw new Error('No institutions found');
      finalInstitutionId = inst.id;
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
    return handleApiError(error, 'Failed to create department');
  }
}
