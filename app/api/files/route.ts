import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/middleware/auth';
import { isAdmin } from '@/lib/auth/permissions';
import { paginatedResponse, parsePagination } from '@/lib/api/pagination';
import { toErrorResponse } from '@/lib/api/error';
import { filesListQuerySchema, uploadFileMetaSchema } from '@/lib/validations/week10';

export const runtime = 'nodejs';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_PREFIXES = ['image/', 'application/pdf', 'text/'];

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function canAcceptMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_PREFIXES.some(prefix => mimeType.startsWith(prefix));
}

export async function GET(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const validatedQuery = filesListQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const search = validatedQuery.search || '';
    const relatedType = validatedQuery.relatedType || '';
    const { page, pageSize, skip } = parsePagination(request);

    const where: any = {
      ...(relatedType ? { relatedType } : {}),
      ...(search ? { filename: { contains: search } } : {}),
    };

    if (!isAdmin(token.roleId)) {
      where.userId = token.id;
    } else if (token.departmentId) {
      where.OR = [
        { user: { departmentId: token.departmentId } },
        { userId: token.id },
      ];
    }

    const [files, total] = await Promise.all([
      prisma.attachment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.attachment.count({ where }),
    ]);

    return NextResponse.json(paginatedResponse(files, total, page, pageSize));
  } catch (error) {
    return toErrorResponse(error, 'Failed to fetch files');
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const uploadMeta = uploadFileMetaSchema.parse({
      relatedType: (formData.get('relatedType') as string | null) || null,
      sessionId: (formData.get('sessionId') as string | null) || null,
      feedbackId: (formData.get('feedbackId') as string | null) || null,
      goalId: (formData.get('goalId') as string | null) || null,
      assignmentId: (formData.get('assignmentId') as string | null) || null,
    });

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File is too large. Max size is 10MB' }, { status: 400 });
    }

    if (file.type && !canAcceptMimeType(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const safeName = sanitizeFileName(file.name);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${safeName}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const diskPath = path.join(uploadDir, uniqueName);
    const publicUrl = `/uploads/${uniqueName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(diskPath, buffer);

    const attachment = await prisma.attachment.create({
      data: {
        filename: safeName,
        url: publicUrl,
        mimeType: file.type || null,
        sizeBytes: file.size,
        relatedType: uploadMeta.relatedType as any,
        userId: token.id,
        sessionId: uploadMeta.sessionId || null,
        feedbackId: uploadMeta.feedbackId || null,
        goalId: uploadMeta.goalId || null,
        assignmentId: uploadMeta.assignmentId || null,
      },
    });

    return NextResponse.json(attachment, { status: 201 });
  } catch (error) {
    return toErrorResponse(error, 'Failed to upload file');
  }
}