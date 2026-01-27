import { apiError } from './response';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


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
export function handleApiError(error: any) {
  console.error('API Error:', error);

  // Prisma errors
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return apiError('Record already exists', 409);
    }
    if (error.code === 'P2025') {
      return apiError('Record not found', 404);
    }
  }

  // Validation errors
  if (error.name === 'ZodError') {
    return apiError('Validation failed', 400, error.errors);
  }

  return apiError('Internal server error', 500);
}