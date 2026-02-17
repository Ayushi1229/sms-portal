import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export interface UserSession {
  id: string;
  email: string;
  roleId: number;
  departmentId: string | null;
}

/**
 * Get current user session from server components
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as UserSession;

    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Check if user has required role
 */
export function hasRequiredRole(userRoleId: number, allowedRoles: number[]): boolean {
  return allowedRoles.includes(userRoleId);
}

/**
 * Role definitions (deprecated - use Role enum from permissions)
 */
export const ROLES = {
  SUPER_ADMIN: 1,
  INSTITUTIONAL_ADMIN: 2,
  DEPARTMENT_ADMIN: 3,
  MENTOR: 4,
  STUDENT: 5,
} as const;

// Re-export role-based utilities
export * from './permissions';
export * from './ProtectedComponent';

/**
 * Role names mapping
 */
export const ROLE_NAMES: Record<number, string> = {
  1: 'Super Admin',
  2: 'Institutional Admin',
  3: 'Department Admin',
  4: 'Mentor',
  5: 'Student',
};

/**
 * Get dashboard URL for role
 */
export function getDashboardUrl(roleId: number): string {
  const dashboardMap: Record<number, string> = {
    1: '/dashboard/admin',
    2: '/dashboard/admin',
    3: '/dashboard/department',
    4: '/dashboard/mentor',
    5: '/dashboard/student',
  };
  return dashboardMap[roleId] || '/dashboard';
}
