import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { verifyToken } from '@/lib/middleware/auth';

// GET - Fetch a single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    return NextResponse.json(user);
  } catch (error) {
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
    // Authenticate the user
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Please login to continue' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { email, firstName, lastName, password, roleId, departmentId, status } = body;

    // SECURITY: Only super admins (roleId: 1) can change user roles
    if (roleId !== undefined && token.roleId !== 1) {
      return NextResponse.json(
        { error: 'Forbidden: Only super admins can change user roles' },
        { status: 403 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (email) updateData.email = email;
    if (roleId) updateData.roleId = roleId;
    if (departmentId) updateData.departmentId = departmentId;
    if (status) updateData.status = status;

    // Hash password if provided
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const profileUpdateData: { firstName?: string; lastName?: string } = {};
    if (firstName) profileUpdateData.firstName = firstName;
    if (lastName) profileUpdateData.lastName = lastName;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        ...(Object.keys(profileUpdateData).length > 0 && {
          profile: {
            update: profileUpdateData,
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
  } catch (error) {
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
    const { id } = await params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // Remove records that block user deletion (onDelete: Restrict)
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

      // Remove profiles explicitly (defensive; also cascades from user)
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
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
