"use client";

import { useAuth } from '@/lib/auth/AuthContext';
import { Role } from '@/lib/auth/permissions';
import { ReactNode } from 'react';

interface ProtectedProps {
  children: ReactNode;
  allowedRoles: number[];
  fallback?: ReactNode;
}

/**
 * Client component to protect content based on user role
 * Usage:
 * <Protected allowedRoles={[Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN]}>
 *   <AdminOnlyButton />
 * </Protected>
 */
export function Protected({ children, allowedRoles, fallback = null }: ProtectedProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user || !allowedRoles.includes(user.roleId)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RoleCheckProps {
  children: (hasPermission: boolean) => ReactNode;
  allowedRoles: number[];
}

/**
 * Render prop component for conditional rendering based on role
 * Usage:
 * <RoleCheck allowedRoles={[Role.SUPER_ADMIN]}>
 *   {(hasPermission) => hasPermission ? <AdminFeature /> : <RestrictedMessage />}
 * </RoleCheck>
 */
export function RoleCheck({ children, allowedRoles }: RoleCheckProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  const hasPermission = user ? allowedRoles.includes(user.roleId) : false;
  return <>{children(hasPermission)}</>;
}

/**
 * Hook to check if current user has specific role
 */
export function useRole(allowedRoles: number[]): boolean {
  const { user } = useAuth();
  return user ? allowedRoles.includes(user.roleId) : false;
}

/**
 * Hook to check if current user is admin (any admin role)
 */
export function useIsAdmin(): boolean {
  return useRole([Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN]);
}

/**
 * Hook to check if current user is super admin
 */
export function useIsSuperAdmin(): boolean {
  return useRole([Role.SUPER_ADMIN]);
}

/**
 * Hook to check if current user is mentor
 */
export function useIsMentor(): boolean {
  return useRole([Role.MENTOR]);
}

/**
 * Hook to check if current user is student
 */
export function useIsStudent(): boolean {
  return useRole([Role.STUDENT]);
}
