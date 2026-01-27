import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError, apiErrorResponse } from '@/lib/api/response';
import { handleApiError } from '@/lib/api/error';

/**
 * GET /api/departments
 * Get all departments with pagination and search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const institutionId = searchParams.get('institutionId');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
      ];
    }

    if (institutionId) {
      where.institutionId = institutionId;
    }

    // Get departments with pagination
    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        skip,
        take: limit,
        include: {
          institution: true,
          users: {
            select: {
              id: true,
              email: true,
              profile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.department.count({ where }),
    ]);

    return NextResponse.json(
      apiResponse({
        departments,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/departments
 * Create a new department
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { institutionId, name, code } = body;

    // Validate required fields
    if (!institutionId || !name || !code) {
      return NextResponse.json(
        apiError('Missing required fields', 400),
        { status: 400 }
      );
    }

    // Check if institution exists
    const institution = await prisma.institution.findUnique({
      where: { id: institutionId },
    });

    if (!institution) {
      return NextResponse.json(
        apiError('Institution not found', 404),
        { status: 404 }
      );
    }

    // Check if department with same code exists in this institution
    const existingDept = await prisma.department.findFirst({
      where: {
        institutionId,
        code,
      },
    });

    if (existingDept) {
      return NextResponse.json(
        apiError('Department with this code already exists', 409),
        { status: 409 }
      );
    }

    // Create department
    const department = await prisma.department.create({
      data: {
        institutionId,
        name,
        code,
      },
      include: {
        institution: true,
      },
    });

    return NextResponse.json(
      apiResponse(department, 'Department created successfully'),
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
