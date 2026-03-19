import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeAuthedRequest, seedUsers } from './helpers/auth';

const prismaMock = {
  mentorAssignment: {
    create: vi.fn(),
  },
  attachment: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
  },
};

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}));

vi.mock('fs/promises', () => ({
  unlink: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
  writeFile: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/services/week8-core', async () => {
  class CoreApiError extends Error {
    status: number;

    constructor(message: string, status = 400) {
      super(message);
      this.status = status;
    }
  }

  return {
    CoreApiError,
    requirePermission: (token: { roleId: number }, permission: string) => {
      if (permission === 'CREATE_ASSIGNMENT' && ![1, 2, 3].includes(token.roleId)) {
        throw new CoreApiError('Forbidden: insufficient permissions', 403);
      }
    },
    validateAssignmentCreation: vi.fn().mockResolvedValue(undefined),
  };
});

describe('Authenticated API routes', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    vi.clearAllMocks();
  });

  it('creates assignment as department admin and stamps assignedById from token', async () => {
    const { POST } = await import('@/app/api/assignments/route');

    prismaMock.mentorAssignment.create.mockResolvedValue({
      id: 'asmt-1',
      mentorId: seedUsers.mentor.id,
      studentId: seedUsers.student.id,
      departmentId: seedUsers.departmentAdmin.departmentId,
      assignedById: seedUsers.departmentAdmin.id,
      status: 'ACTIVE',
    });

    const request = await makeAuthedRequest('/api/assignments', seedUsers.departmentAdmin, 'POST', {
      mentorId: seedUsers.mentor.id,
      studentId: seedUsers.student.id,
      departmentId: seedUsers.departmentAdmin.departmentId,
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(prismaMock.mentorAssignment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          assignedById: seedUsers.departmentAdmin.id,
        }),
      })
    );
    expect(body.assignedById).toBe(seedUsers.departmentAdmin.id);
  });

  it('blocks assignment creation for mentor role', async () => {
    const { POST } = await import('@/app/api/assignments/route');

    const request = await makeAuthedRequest('/api/assignments', seedUsers.mentor, 'POST', {
      mentorId: seedUsers.mentor.id,
      studentId: seedUsers.student.id,
      departmentId: seedUsers.departmentAdmin.departmentId,
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
  });

  it('lists files for non-admin user with ownership scope', async () => {
    const { GET } = await import('@/app/api/files/route');

    prismaMock.attachment.findMany.mockResolvedValue([
      {
        id: 'f1',
        filename: 'notes.pdf',
        url: '/uploads/notes.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 1000,
        relatedType: null,
        createdAt: new Date(),
      },
    ]);
    prismaMock.attachment.count.mockResolvedValue(1);

    const request = await makeAuthedRequest('/api/files?page=1&pageSize=10', seedUsers.student);
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(prismaMock.attachment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: seedUsers.student.id }),
      })
    );
    expect(body.pagination.total).toBe(1);
    expect(body.items).toHaveLength(1);
  });

  it('deletes file when requester is owner', async () => {
    const { DELETE } = await import('@/app/api/files/[id]/route');

    prismaMock.attachment.findUnique.mockResolvedValue({
      id: 'file-1',
      userId: seedUsers.student.id,
      user: { id: seedUsers.student.id, departmentId: seedUsers.student.departmentId },
      url: '/uploads/file-1.txt',
    });
    prismaMock.attachment.delete.mockResolvedValue({ id: 'file-1' });

    const request = await makeAuthedRequest('/api/files/file-1', seedUsers.student, 'DELETE');
    const response = await DELETE(request, { params: Promise.resolve({ id: 'file-1' }) });

    expect(response.status).toBe(200);
    expect(prismaMock.attachment.delete).toHaveBeenCalledWith({ where: { id: 'file-1' } });
  });

  it('blocks file delete for unauthorized non-owner non-admin user', async () => {
    const { DELETE } = await import('@/app/api/files/[id]/route');

    prismaMock.attachment.findUnique.mockResolvedValue({
      id: 'file-2',
      userId: seedUsers.mentor.id,
      user: { id: seedUsers.mentor.id, departmentId: seedUsers.mentor.departmentId },
      url: '/uploads/file-2.txt',
    });

    const request = await makeAuthedRequest('/api/files/file-2', seedUsers.student, 'DELETE');
    const response = await DELETE(request, { params: Promise.resolve({ id: 'file-2' }) });

    expect(response.status).toBe(403);
  });
});
