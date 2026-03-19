import { SignJWT } from 'jose';
import { NextRequest } from 'next/server';

export interface SeedUser {
  id: string;
  email: string;
  roleId: number;
  departmentId: string | null;
}

export const seedUsers = {
  superAdmin: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'superadmin@sms.local',
    roleId: 1,
    departmentId: null,
  } as SeedUser,
  departmentAdmin: {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'deptadmin@sms.local',
    roleId: 3,
    departmentId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  } as SeedUser,
  mentor: {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'mentor@sms.local',
    roleId: 4,
    departmentId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  } as SeedUser,
  student: {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'student@sms.local',
    roleId: 5,
    departmentId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  } as SeedUser,
};

export async function createAccessToken(user: SeedUser) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

  return await new SignJWT({
    id: user.id,
    email: user.email,
    roleId: user.roleId,
    departmentId: user.departmentId,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secret);
}

export async function makeAuthedRequest(path: string, user: SeedUser, method = 'GET', body?: unknown) {
  const token = await createAccessToken(user);
  const headers: HeadersInit = {
    Cookie: `accessToken=${token}`,
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  return new NextRequest(
    new Request(`http://localhost${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  );
}
