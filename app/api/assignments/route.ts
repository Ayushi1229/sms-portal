import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/assignments
 */
export async function GET(request: NextRequest) {
  try {
    const assignments = await prisma.mentorAssignment.findMany({
      include: {
        mentor: { include: { profile: true } },
        student: { include: { profile: true } },
        department: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedAssignments = assignments.map(a => ({
      id: a.id,
      mentor: `${a.mentor.profile?.firstName || ''} ${a.mentor.profile?.lastName || ''}`.trim(),
      student: `${a.student.profile?.firstName || ''} ${a.student.profile?.lastName || ''}`.trim(),
      assignedDate: a.createdAt.toISOString().split('T')[0],
      status: a.status === 'ACTIVE' ? 'Active' : 'Completed',
      department: a.department?.name || 'N/A',
      progress: 50, // This would require complex logic to calculate across goals
    }));

    return NextResponse.json(formattedAssignments);
  } catch (error: any) {
    console.error('Get assignments error:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}

/**
 * POST /api/assignments
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mentorId, studentId, departmentId, createdById } = body;

    if (!mentorId || !studentId || !departmentId || !createdById) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const assignment = await prisma.mentorAssignment.create({
      data: {
        mentorId,
        studentId,
        departmentId,
        assignedById: createdById,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error: any) {
    console.error('Create assignment error:', error);
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
  }
}
