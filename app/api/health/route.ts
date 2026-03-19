import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: 'ok',
        app: 'sms-portal',
        database: 'reachable',
        timestamp: new Date().toISOString(),
        responseMs: Date.now() - startedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        app: 'sms-portal',
        database: 'unreachable',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}