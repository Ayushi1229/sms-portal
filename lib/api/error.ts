import { NextResponse } from 'next/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';


export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function zodIssuesToRecord(error: ZodError) {
  const result: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || 'root';
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(issue.message);
  }
  return result;
}

export function toErrorResponse(error: unknown, fallbackMessage = 'Internal server error') {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        errors: error.errors,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Record already exists' }, { status: 409 });
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Database operation failed' }, { status: 400 });
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        errors: zodIssuesToRecord(error),
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json({ success: false, error: error.message || fallbackMessage }, { status: 500 });
  }

  return NextResponse.json({ success: false, error: fallbackMessage }, { status: 500 });
}

export function handleApiError(error: unknown, fallbackMessage = 'Internal server error') {
  return toErrorResponse(error, fallbackMessage);
}