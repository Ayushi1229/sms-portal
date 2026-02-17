# Authentication & Authorization - Week 7 Implementation

## Overview
Complete authentication and authorization system with role-based access control (RBAC) has been implemented for the Student Mentoring Management System.

## Features Implemented

### 1. **JWT Authentication**
- Secure token-based authentication using JWT
- Access tokens (15 minutes expiry) stored in HttpOnly cookies
- Refresh tokens (7 days expiry) for maintaining sessions
- Automatic token verification on protected routes

### 2. **Role-Based Access Control (RBAC)**
- Five user roles with different permission levels:
  - **Super Admin** (ID: 1) - Full system access
  - **Institutional Admin** (ID: 2) - Institution-level management
  - **Department Admin** (ID: 3) - Department-level management
  - **Mentor** (ID: 4) - Mentor-specific features
  - **Student** (ID: 5) - Student-specific features

### 3. **Protected Routes**
Routes are protected at two levels:

#### Middleware Level (Server-Side)
- Checks authentication status
- Validates user roles for specific routes
- Redirects unauthorized users to `/unauthorized`
- Redirects unauthenticated users to `/login`

#### Route-Role Mappings:
```typescript
/dashboard/admin       → Super Admin, Institutional Admin (1, 2)
/dashboard/department  → Department Admin (3)
/dashboard/mentor      → Mentor (4)
/dashboard/student     → Student (5)
/users                 → Super Admin, Institutional Admin (1, 2)
/institutions          → Super Admin (1)
/departments           → All Admins (1, 2, 3)
/roles                 → Super Admin (1)
/permissions           → Super Admin (1)
```

### 4. **Automatic Dashboard Routing**
- Users are automatically redirected to role-appropriate dashboards after login
- `/dashboard` route automatically redirects based on user role
- Maintains previous URL for post-login redirect

### 5. **Session Management**
- Persistent sessions using HttpOnly cookies
- Automatic session validation on protected pages
- Secure logout functionality clearing all tokens

## API Endpoints

### Authentication Routes

#### POST `/api/auth/login`
Login with email and password
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "message": "Login successful"
  }
}
```

#### GET `/api/auth/me`
Get current authenticated user
```json
Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "roleId": 1,
    "role": { "id": 1, "name": "super_admin" },
    "department": { /* department object */ },
    "profile": { /* profile object */ }
  }
}
```

#### POST `/api/auth/logout`
Logout current user and clear tokens

#### POST `/api/auth/refresh`
Refresh access token using refresh token

## Demo Credentials

### Super Admin
```
Email: admin@example.com
Password: admin123
Dashboard: /dashboard/admin
```

### Institutional Admin
```
Email: inst.admin@example.com
Password: admin123
Dashboard: /dashboard/admin
```

### Department Admin
```
Email: dept.admin@example.com
Password: admin123
Dashboard: /dashboard/department
```

### Mentor
```
Email: mentor@example.com
Password: mentor123
Dashboard: /dashboard/mentor
```

### Student
```
Email: student@example.com
Password: student123
Dashboard: /dashboard/student
```

## File Structure

```
lib/
├── auth/
│   ├── index.ts           # Auth utilities and role definitions
│   └── AuthContext.tsx    # Client-side auth context
├── middleware/
│   └── auth.ts           # JWT verification and API protection
middleware.ts             # Next.js middleware for route protection

app/
├── (auth)/
│   └── login/
│       └── LoginForm.tsx  # Updated with role-based routing
├── (dashboard)/
│   └── dashboard/
│       ├── page.tsx       # Auto-redirect based on role
│       ├── admin/         # Admin dashboard
│       ├── department/    # Department admin dashboard
│       ├── mentor/        # Mentor dashboard
│       └── student/       # Student dashboard
└── api/
    └── auth/
        ├── login/         # Login endpoint
        ├── logout/        # Logout endpoint
        ├── me/            # Get current user
        └── refresh/       # Token refresh
```

## Security Features

1. **HttpOnly Cookies**: Tokens stored in HttpOnly cookies prevent XSS attacks
2. **Secure Cookies**: In production, cookies are only sent over HTTPS
3. **SameSite Strict**: Prevents CSRF attacks
4. **Short-lived Access Tokens**: 15-minute expiry reduces token theft impact
5. **Password Hashing**: bcrypt with salt for secure password storage
6. **Role Validation**: Both client and server-side role checking
7. **Token Expiry**: Automatic token expiration and refresh mechanism

## Usage Examples

### Server Component - Check User Role
```typescript
import { getCurrentUser, ROLES } from '@/lib/auth';

export default async function AdminPage() {
  const user = await getCurrentUser();
  
  if (!user || user.roleId !== ROLES.SUPER_ADMIN) {
    redirect('/unauthorized');
  }
  
  return <div>Admin Content</div>;
}
```

### Client Component - Use Auth Context
```typescript
'use client';
import { useAuth } from '@/lib/auth/AuthContext';

export default function ProfileComponent() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### API Route - Protect with Role
```typescript
import { withRoleAuth } from '@/lib/middleware/auth';
import { ROLES } from '@/lib/auth';

export const GET = withRoleAuth(
  [ROLES.SUPER_ADMIN, ROLES.INSTITUTIONAL_ADMIN],
  async (request: NextRequest) => {
    // Only admins can access this endpoint
    return NextResponse.json({ data: 'Protected data' });
  }
);
```

## Testing Instructions

1. **Start the Application**
   ```bash
   npm run dev
   ```

2. **Test Login Flow**
   - Navigate to `http://localhost:3000/login`
   - Use any demo credentials from above
   - Verify automatic redirect to role-appropriate dashboard

3. **Test Protected Routes**
   - Try accessing `/dashboard/admin` as a student
   - Should redirect to `/unauthorized`
   - Try accessing `/dashboard/student` as admin
   - Should redirect to `/unauthorized`

4. **Test Session Persistence**
   - Login and refresh the page
   - Session should persist
   - Close browser and reopen (if refresh token valid)
   - Should still be logged in

5. **Test Logout**
   - Click logout button
   - Should clear session and redirect to login
   - Try accessing protected route
   - Should redirect to login

## Environment Variables Required

```env
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
DATABASE_URL=your-database-url
NODE_ENV=development
```

## Next Steps

1. **Week 8**: Implement core features with proper role-based permissions
2. **Week 9**: Add advanced features (search, filtering, pagination)
3. **Week 10**: Comprehensive testing and error handling
4. **Week 11**: Production deployment with environment setup

## Troubleshooting

### Issue: "Unauthorized" error on dashboard
**Solution**: Clear cookies and login again

### Issue: Stuck in redirect loop
**Solution**: Check middleware.ts - ensure login route is in publicRoutes

### Issue: Role-based routing not working
**Solution**: Verify user's roleId matches expected values (1-5)

### Issue: Token expired too quickly
**Solution**: Implement refresh token mechanism or increase token expiry

---

**Week 7 Completion Status**: ✅ Complete
- ✅ User Authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ Protected Routes
- ✅ Session Handling
- ✅ Role-Based Dashboard Routing
