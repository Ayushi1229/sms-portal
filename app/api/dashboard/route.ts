import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/middleware/auth';
import { apiResponse, apiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';
/**
 * GET /api/dashboard
 * Get dashboard statistics and analytics
 */
export async function GET(request: NextRequest) {
  try {
    const token = verifyToken(request);
    if (!token) {
      return apiError('Unauthorized', 401);
    }

    // Get overall statistics
    const [
      totalStudents,
      totalMentors,
      totalSessions,
      completedSessions,
      activeAssignments,
      totalGoals,
      completedGoals,
    ] = await Promise.all([
      prisma.studentProfile.count(),
      prisma.mentorProfile.count(),
      prisma.sessionRecord.count(),
      prisma.sessionRecord.count({ where: { status: 'COMPLETED' } }),
      prisma.mentorAssignment.count({ where: { status: 'ACTIVE' } }),
      prisma.goal.count(),
      prisma.goal.count({ where: { status: 'COMPLETED' } }),
    ]);

    // Get recent sessions
    const recentSessions = await prisma.sessionRecord.findMany({
      take: 5,
      orderBy: { scheduledAt: 'desc' },
      include: {
        mentor: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
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
    });

    // Get students by risk level
    const riskLevelStats = await prisma.studentProfile.groupBy({
      by: ['riskLevel'],
      _count: true,
    });

    // Get session status breakdown
    const sessionStatusStats = await prisma.sessionRecord.groupBy({
      by: ['status'],
      _count: true,
    });

    // Get mentor availability
    const mentorAvailability = await prisma.mentorProfile.groupBy({
      by: ['availabilityStatus'],
      _count: true,
    });

    return NextResponse.json(
      apiResponse({
        statistics: {
          totalStudents,
          totalMentors,
          totalSessions,
          completedSessions,
          activeAssignments,
          totalGoals,
          completedGoals,
          sessionCompletionRate: totalSessions > 0 
            ? ((completedSessions / totalSessions) * 100).toFixed(2) 
            : 0,
          goalCompletionRate: totalGoals > 0 
            ? ((completedGoals / totalGoals) * 100).toFixed(2) 
            : 0,
        },
        recentSessions,
        analytics: {
          riskLevelDistribution: riskLevelStats,
          sessionStatus: sessionStatusStats,
          mentorAvailability,
        },
      }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Dashboard error:', error);
    return apiError('Failed to fetch dashboard data', 500);
  } finally {
    await prisma.$disconnect();
  }
}