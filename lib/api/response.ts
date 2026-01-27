import { NextResponse } from 'next/server';

export function apiResponse(data: any, message?: string) {
  return {
    success: true,
    data,
    message: message || 'Success',
  };
}

export function apiError(message: string, status: number = 400, errors?: any) {
  return {
    success: false,
    error: message,
    errors,
  };
}

export function apiErrorResponse(message: string, status: number = 400, errors?: any) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      errors,
    },
    { status }
  );
}