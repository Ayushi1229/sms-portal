import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/institutions
 * Get all institutions
 */
export async function GET(request: NextRequest) {
  try {
    const institutions = await prisma.institution.findMany({
      include: {
        _count: {
          select: {
            departments: true,
            users: true,
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
      orderBy: { name: 'asc' },
    });

    const formattedInstitutions = institutions.map(inst => {
      const mentors = inst.users.filter(u => u.role.name === 'mentor').length;
      const students = inst.users.filter(u => u.role.name === 'student').length;
      
      return {
        id: inst.id,
        code: inst.code,
        name: inst.name,
        address: inst.address || 'N/A',
        email: inst.contactEmail || 'N/A',
        departments: inst._count.departments,
        mentors: mentors,
        students: students,
        status: 'Active',
      };
    });

    return NextResponse.json(formattedInstitutions);
  } catch (error: any) {
    console.error('Get institutions error:', error);
    return NextResponse.json({ error: 'Failed to fetch institutions' }, { status: 500 });
  }
}

/**
 * POST /api/institutions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, address, contactEmail } = body;

    if (!name || !code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const institution = await prisma.institution.create({
      data: {
        name,
        code,
        address,
        contactEmail,
      },
    });

    return NextResponse.json(institution, { status: 201 });
  } catch (error: any) {
    console.error('Create institution error:', error);
    return NextResponse.json({ error: 'Failed to create institution' }, { status: 500 });
  }
}
