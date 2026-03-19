import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { ApiError, toErrorResponse } from '@/lib/api/error';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('centralized API error mapping', () => {
  it('maps ApiError to consistent payload and status', async () => {
    const response = toErrorResponse(
      new ApiError('Forbidden action', 403, { role: ['Insufficient permission'] })
    );

    expect(response.status).toBe(403);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Forbidden action');
    expect(body.errors).toEqual({ role: ['Insufficient permission'] });
  });

  it('maps ZodError to validation payload with field-level errors', async () => {
    const zodError = new ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['email'],
        message: 'Expected string, received number',
      },
      {
        code: 'too_small',
        minimum: 8,
        type: 'string',
        inclusive: true,
        exact: false,
        path: ['password'],
        message: 'String must contain at least 8 character(s)',
      },
    ]);

    const response = toErrorResponse(zodError);
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Validation failed');
    expect(body.errors.email).toContain('Expected string, received number');
    expect(body.errors.password).toContain('String must contain at least 8 character(s)');
  });

  it('maps Prisma known request errors for duplicate records', async () => {
    const prismaError = Object.create(PrismaClientKnownRequestError.prototype) as PrismaClientKnownRequestError;
    (prismaError as unknown as { code: string }).code = 'P2002';

    const response = toErrorResponse(prismaError);
    expect(response.status).toBe(409);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Record already exists');
  });

  it('maps generic errors to fallback 500 format', async () => {
    const response = toErrorResponse(new Error('Something broke'), 'Operation failed');
    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Something broke');
  });
});
