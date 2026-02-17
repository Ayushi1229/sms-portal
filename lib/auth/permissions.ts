/**
 * Role-based access control utilities
 */

export enum Role {
  SUPER_ADMIN = 1,
  INSTITUTIONAL_ADMIN = 2,
  DEPARTMENT_ADMIN = 3,
  MENTOR = 4,
  STUDENT = 5,
}

export const RoleNames: Record<number, string> = {
  [Role.SUPER_ADMIN]: 'Super Admin',
  [Role.INSTITUTIONAL_ADMIN]: 'Institutional Admin',
  [Role.DEPARTMENT_ADMIN]: 'Department Admin',
  [Role.MENTOR]: 'Mentor',
  [Role.STUDENT]: 'Student',
};

/**
 * Check if user has permission to access a resource
 */
export function hasPermission(userRoleId: number, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRoleId as Role);
}

/**
 * Check if user is an admin (any admin role)
 */
export function isAdmin(userRoleId: number): boolean {
  return [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN].includes(userRoleId);
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(userRoleId: number): boolean {
  return userRoleId === Role.SUPER_ADMIN;
}

/**
 * Check if user is mentor
 */
export function isMentor(userRoleId: number): boolean {
  return userRoleId === Role.MENTOR;
}

/**
 * Check if user is student
 */
export function isStudent(userRoleId: number): boolean {
  return userRoleId === Role.STUDENT;
}

/**
 * Get dashboard route based on role
 */
export function getDashboardRoute(userRoleId: number): string {
  switch (userRoleId) {
    case Role.SUPER_ADMIN:
    case Role.INSTITUTIONAL_ADMIN:
      return '/dashboard';
    case Role.DEPARTMENT_ADMIN:
      return '/dashboard';
    case Role.MENTOR:
      return '/dashboard';
    case Role.STUDENT:
      return '/dashboard';
    default:
      return '/dashboard';
  }
}

/**
 * Get allowed navigation items based on role
 */
export interface NavItem {
  name: string;
  href: string;
  icon?: string;
}

export function getAllowedNavigation(userRoleId: number): NavItem[] {
  const commonItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Notifications', href: '/notifications' },
    { name: 'Settings', href: '/settings' },
  ];

  switch (userRoleId) {
    case Role.SUPER_ADMIN:
      return [
        ...commonItems,
        { name: 'Users', href: '/users' },
        { name: 'Institutions', href: '/institutions' },
        { name: 'Departments', href: '/departments' },
        { name: 'Roles', href: '/roles' },
        { name: 'Permissions', href: '/permissions' },
        { name: 'Students', href: '/students' },
        { name: 'Mentors', href: '/mentors' },
        { name: 'Sessions', href: '/sessions' },
        { name: 'Goals', href: '/goals' },
        { name: 'Reports', href: '/reports' },
        { name: 'Audit', href: '/audit' },
      ];

    case Role.INSTITUTIONAL_ADMIN:
      return [
        ...commonItems,
        { name: 'Users', href: '/users' },
        { name: 'Departments', href: '/departments' },
        { name: 'Students', href: '/students' },
        { name: 'Mentors', href: '/mentors' },
        { name: 'Sessions', href: '/sessions' },
        { name: 'Goals', href: '/goals' },
        { name: 'Reports', href: '/reports' },
        { name: 'Audit', href: '/audit' },
      ];

    case Role.DEPARTMENT_ADMIN:
      return [
        ...commonItems,
        { name: 'Students', href: '/students' },
        { name: 'Mentors', href: '/mentors' },
        { name: 'Sessions', href: '/sessions' },
        { name: 'Goals', href: '/goals' },
        { name: 'Reports', href: '/reports' },
        { name: 'Assignments', href: '/assignments' },
      ];

    case Role.MENTOR:
      return [
        ...commonItems,
        { name: 'My Students', href: '/students' },
        { name: 'Sessions', href: '/sessions' },
        { name: 'Goals', href: '/goals' },
        { name: 'Feedback', href: '/feedback' },
        { name: 'Assignments', href: '/assignments' },
      ];

    case Role.STUDENT:
      return [
        ...commonItems,
        { name: 'My Mentor', href: '/mentors' },
        { name: 'Sessions', href: '/sessions' },
        { name: 'My Goals', href: '/goals' },
        { name: 'Feedback', href: '/feedback' },
      ];

    default:
      return commonItems;
  }
}

/**
 * Feature permissions matrix
 */
export const Permissions = {
  // User management
  CREATE_USER: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN],
  EDIT_USER: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN],
  DELETE_USER: [Role.SUPER_ADMIN],
  VIEW_ALL_USERS: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN],

  // Institution management
  MANAGE_INSTITUTIONS: [Role.SUPER_ADMIN],
  MANAGE_DEPARTMENTS: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN],

  // Student management
  CREATE_STUDENT: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN],
  EDIT_STUDENT: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN],
  VIEW_ALL_STUDENTS: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN],
  VIEW_ASSIGNED_STUDENTS: [Role.MENTOR],

  // Mentor management
  CREATE_MENTOR: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN],
  EDIT_MENTOR: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN],
  VIEW_ALL_MENTORS: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN],

  // Session management
  CREATE_SESSION: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN, Role.MENTOR],
  EDIT_SESSION: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN, Role.MENTOR],
  VIEW_ALL_SESSIONS: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN],
  VIEW_OWN_SESSIONS: [Role.MENTOR, Role.STUDENT],

  // Goal management
  CREATE_GOAL: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN, Role.MENTOR],
  EDIT_GOAL: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN, Role.MENTOR],
  VIEW_ALL_GOALS: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN],
  VIEW_OWN_GOALS: [Role.MENTOR, Role.STUDENT],

  // Reports and analytics
  VIEW_REPORTS: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN],
  VIEW_AUDIT_LOGS: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN],

  // Assignments
  CREATE_ASSIGNMENT: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN],
  EDIT_ASSIGNMENT: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN],
  VIEW_ALL_ASSIGNMENTS: [Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN, Role.DEPARTMENT_ADMIN],
};

/**
 * Check if user can perform an action
 */
export function canPerformAction(userRoleId: number, permissionKey: keyof typeof Permissions): boolean {
  const allowedRoles = Permissions[permissionKey];
  return allowedRoles.includes(userRoleId as Role);
}
