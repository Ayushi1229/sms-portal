import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { verifyToken } from '@/lib/middleware/auth';
import { canPerformAction, isAdmin, Role } from '@/lib/auth/permissions';
import { CoreApiError, requirePermission } from '@/lib/services/week8-core';

function assertUserAccess(requester: { id: string; roleId: number; departmentId: string | null }, target: { id: string; departmentId: string | null }) {
  const isSelf = requester.id === target.id;
  if (isSelf) {
    return;
  }

  if (!isAdmin(requester.roleId)) {
    throw new CoreApiError('Forbidden: insufficient permissions', 403);
  }

  if (requester.departmentId && target.departmentId !== requester.departmentId) {
    throw new CoreApiError('Forbidden: cross-department access denied', 403);
  }
}

// GET - Fetch a single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        status: true,
        roleId: true,
        departmentId: true,
        role: {
          select: {
            id: true,
            name: true,
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
            phone: true,
            title: true,
            bio: true,
          },
        },
        mentorProfile: {
          select: {
            designation: true,
            specialization: true,
            maxMentees: true,
            availabilityStatus: true,
          }
        },
        studentProfile: {
          select: {
            rollNumber: true,
            program: true,
            yearOfStudy: true,
            gpa: true,
            riskLevel: true,
          }
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    assertUserAccess(token, { id: user.id, departmentId: user.departmentId });

    return NextResponse.json(user);
  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT - Update a user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { email, firstName, lastName, phone, title, bio, password, roleId, departmentId, status } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        departmentId: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const isSelf = token.id === id;
    if (!isSelf && !canPerformAction(token.roleId, 'EDIT_USER')) {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
    }

    if (token.departmentId && existingUser.departmentId !== token.departmentId) {
      return NextResponse.json({ error: 'Forbidden: cross-department access denied' }, { status: 403 });
    }

    if (roleId !== undefined && token.roleId !== Role.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Only super admins can change user roles' }, { status: 403 });
    }

    if (!isAdmin(token.roleId) && (departmentId !== undefined || status !== undefined)) {
      return NextResponse.json({ error: 'Forbidden: only admins can change department or status' }, { status: 403 });
    }

    if (email) {
      const existingByEmail = await prisma.user.findFirst({
        where: {
          email,
          id: { not: id },
        },
        select: { id: true },
      });

      if (existingByEmail) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
      }
    }

    const updateData: any = {};
    if (email) updateData.email = email;
    if (roleId !== undefined) updateData.roleId = roleId;
    if (departmentId !== undefined) updateData.departmentId = departmentId;
    if (status !== undefined) updateData.status = status;

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const profileUpdateData: { firstName?: string; lastName?: string; phone?: string; title?: string; bio?: string } = {};
    if (firstName) profileUpdateData.firstName = firstName;
    if (lastName) profileUpdateData.lastName = lastName;
    if (phone !== undefined) profileUpdateData.phone = phone;
    if (title !== undefined) profileUpdateData.title = title;
    if (bio !== undefined) profileUpdateData.bio = bio;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        ...(Object.keys(profileUpdateData).length > 0 && {
          profile: {
            upsert: {
              update: profileUpdateData,
              create: {
                firstName: profileUpdateData.firstName || '',
                lastName: profileUpdateData.lastName || '',
              },
            },
          },
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

    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    requirePermission(token, 'DELETE_USER');

    const { id } = await params;

    if (token.id === id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        departmentId: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (token.departmentId && existingUser.departmentId !== token.departmentId) {
      return NextResponse.json({ error: 'Forbidden: cross-department access denied' }, { status: 403 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.sessionFeedback.deleteMany({
        where: {
          OR: [{ giverUserId: id }, { recipientUserId: id }],
        },
      });

      await tx.goalUpdate.deleteMany({
        where: { notedById: id },
      });

      await tx.goal.deleteMany({
        where: { createdById: id },
      });

      await tx.sessionRecord.deleteMany({
        where: { createdById: id },
      });

      await tx.mentorAssignment.deleteMany({
        where: {
          OR: [{ mentorId: id }, { studentId: id }, { assignedById: id }],
        },
      });

      await tx.mentorProfile.deleteMany({ where: { userId: id } });
      await tx.studentProfile.deleteMany({ where: { userId: id } });
      await tx.userProfile.deleteMany({ where: { userId: id } });

      await tx.user.delete({
        where: { id },
      });
    });

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof CoreApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
