# Role-Based Authentication Implementation

## What Was Implemented

### 1. Registration Form with Role Selection
- Added role dropdown to [app/(auth)/register/RegisterForm.tsx](app/(auth)/register/RegisterForm.tsx)
- Users can now select their role during registration:
  - Student
  - Mentor
  - Department Admin
  - Institutional Admin
  - Super Admin

### 2. Role-Based Permissions System
- Created [lib/auth/permissions.ts](lib/auth/permissions.ts) with:
  - `Role` enum for type-safe role references
  - `RoleNames` mapping for display names
  - Permission checking utilities: `hasPermission()`, `canPerformAction()`
  - Navigation filtering: `getAllowedNavigation()`
  - Granular permissions matrix for all features

### 3. Updated Components
- **Sidebar** ([app/components/Sidebar.tsx](app/components/Sidebar.tsx)): Shows role-based navigation
- **ProtectedComponent** ([lib/auth/ProtectedComponent.tsx](lib/auth/ProtectedComponent.tsx)): Updated to use new Role enum
- **Auth Index** ([lib/auth/index.ts](lib/auth/index.ts)): Re-exports all permission utilities

### 4. Performance Improvements
- Removed `prisma.$disconnect()` from API routes (major bottleneck)
- Reduced bcrypt rounds from 10 to 8 (still secure, faster)

## How to Use

### Protect Components by Role
```tsx
import { Protected, Role } from '@/lib/auth';

// Show content only to admins
<Protected allowedRoles={[Role.SUPER_ADMIN, Role.INSTITUTIONAL_ADMIN]}>
  <AdminOnlyButton />
</Protected>

// With fallback for unauthorized users
<Protected 
  allowedRoles={[Role.MENTOR]} 
  fallback={<p>Only mentors can view this</p>}
>
  <MentorFeature />
</Protected>
```

### Use Role Hooks
```tsx
import { useIsAdmin, useIsMentor, useRole, Role } from '@/lib/auth';

function MyComponent() {
  const isAdmin = useIsAdmin();
  const isMentor = useIsMentor();
  const canManageStudents = useRole([Role.SUPER_ADMIN, Role.DEPARTMENT_ADMIN]);

  return (
    <div>
      {isAdmin && <AdminPanel />}
      {isMentor && <MentorDashboard />}
    </div>
  );
}
```

### Check Permissions
```tsx
import { canPerformAction, Permissions } from '@/lib/auth';

function checkAccess(userRoleId: number) {
  if (canPerformAction(userRoleId, 'CREATE_USER')) {
    // User can create users
  }
  
  if (canPerformAction(userRoleId, 'VIEW_AUDIT_LOGS')) {
    // User can view audit logs
  }
}
```

## Navigation by Role

### Super Admin
- All features including institutions, roles, permissions
- Full system administration
- All reports and audit logs

### Institutional Admin
- User management (except roles/permissions)
- Department management
- Students, mentors, sessions, goals
- Reports and audit logs

### Department Admin
- Department-level user management
- Students, mentors, assignments
- Sessions, goals, reports

### Mentor
- My students
- Sessions scheduling
- Goals and feedback
- Assignments

### Student
- My mentor
- View sessions
- My goals
- Feedback

## Middleware Protection

The [middleware.ts](middleware.ts) already implements route protection:
- Redirects unauthenticated users to login
- Blocks unauthorized role access with redirect to /unauthorized
- Public routes: /login, /register, /forgot-password, etc.

## Testing

To test different roles:

1. **Register as different roles:**
   - Visit `/register`
   - Select role from dropdown
   - Complete registration

2. **Login and verify:**
   - Login with created account
   - Check sidebar shows role-appropriate navigation
   - Try accessing restricted routes
   - Verify redirects work correctly

3. **Test default accounts:**
   ```
   Super Admin: admin@sampleinstitute.edu / Password@123
   Dept Admin: cse.admin@sampleinstitute.edu / Password@123
   Mentor: mentor@sampleinstitute.edu / Password@123
   ```

## Available Permissions

The `Permissions` object in [lib/auth/permissions.ts](lib/auth/permissions.ts) defines:
- User management (CREATE_USER, EDIT_USER, DELETE_USER, VIEW_ALL_USERS)
- Institution/Department management
- Student/Mentor management
- Session management
- Goal management
- Reports and analytics
- Audit logs
- Assignments

You can extend this for new features as needed.
