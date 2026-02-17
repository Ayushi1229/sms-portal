# 🔐 Week 7 - Authentication & Authorization Quick Reference

## ✅ Completed Tasks

### 1. JWT Authentication System
- ✅ Secure token generation and validation
- ✅ HttpOnly cookies for XSS protection
- ✅ 15-minute access tokens + 7-day refresh tokens
- ✅ Automatic token verification

### 2. Role-Based Access Control (RBAC)
- ✅ 5 user roles with hierarchical permissions
- ✅ Server-side middleware protection
- ✅ Client-side auth context
- ✅ API route protection with role checking

### 3. Protected Routes
- ✅ Next.js middleware for route protection
- ✅ Automatic redirect to login for unauthenticated users
- ✅ Role-based access restrictions
- ✅ Unauthorized page for access denied

### 4. Role-Based Dashboard Routing
- ✅ Automatic redirect to role-specific dashboards
- ✅ Support for redirect after login
- ✅ Dashboard route mapping

### 5. Session Management
- ✅ Persistent login sessions
- ✅ Logout functionality
- ✅ Session refresh mechanism

## 🎯 Demo Credentials

| Role | Email | Password | Dashboard URL |
|------|-------|----------|---------------|
| Super Admin | `admin@example.com` | `admin123` | `/dashboard/admin` |
| Institutional Admin | `inst.admin@example.com` | `admin123` | `/dashboard/admin` |
| Department Admin | `dept.admin@example.com` | `admin123` | `/dashboard/department` |
| Mentor | `mentor@example.com` | `mentor123` | `/dashboard/mentor` |
| Student | `student@example.com` | `student123` | `/dashboard/student` |

## 🚀 Quick Start

### 1. Create Demo Users
```bash
node scripts/create-demo-users.js
```

### 2. Start the Application
```bash
npm run dev
```

### 3. Test Authentication
1. Go to `http://localhost:3000/login`
2. Use any demo credentials above
3. You'll be redirected to the role-specific dashboard

## 🔒 Security Features

- **HttpOnly Cookies** - Prevents XSS attacks
- **Secure Cookies** - HTTPS-only in production
- **SameSite Strict** - CSRF protection
- **Password Hashing** - bcrypt with salt
- **Token Expiry** - Short-lived access tokens
- **Role Validation** - Server and client-side

## 📁 Key Files Modified/Created

### New Files
- `lib/auth/index.ts` - Auth utilities and role definitions
- `lib/auth/AuthContext.tsx` - Client auth context
- `scripts/create-demo-users.js` - Demo user creation
- `docs/WEEK7_AUTH_IMPLEMENTATION.md` - Full documentation

### Modified Files
- `middleware.ts` - Route protection with RBAC
- `lib/middleware/auth.ts` - Enhanced with role checking
- `app/(auth)/login/LoginForm.tsx` - Role-based login
- `app/(dashboard)/dashboard/page.tsx` - Auto-redirect
- `app/api/auth/me/route.ts` - Fixed password field

## 🧪 Testing Checklist

- [ ] Login with each role type
- [ ] Verify correct dashboard redirect
- [ ] Try accessing unauthorized routes
- [ ] Test logout functionality
- [ ] Check session persistence
- [ ] Verify token refresh works

## 🎨 Role Permissions Matrix

| Feature | Super Admin | Inst. Admin | Dept. Admin | Mentor | Student |
|---------|-------------|-------------|-------------|--------|---------|
| Admin Dashboard | ✅ | ✅ | ❌ | ❌ | ❌ |
| Dept Dashboard | ❌ | ❌ | ✅ | ❌ | ❌ |
| Mentor Dashboard | ❌ | ❌ | ❌ | ✅ | ❌ |
| Student Dashboard | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage Users | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Institutions | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Departments | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage Roles | ✅ | ❌ | ❌ | ❌ | ❌ |

## 🔧 Environment Variables

```env
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
DATABASE_URL=mysql://user:password@localhost:3306/smms
NODE_ENV=development
```

## 📚 Usage Examples

### Server Component
```typescript
import { getCurrentUser, ROLES } from '@/lib/auth';

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  // Use user.roleId to check permissions
}
```

### Client Component
```typescript
'use client';
import { useAuth } from '@/lib/auth/AuthContext';

export default function Component() {
  const { user, logout } = useAuth();
  // Access user.roleId, user.email, etc.
}
```

### API Route Protection
```typescript
import { withRoleAuth } from '@/lib/middleware/auth';

export const GET = withRoleAuth([1, 2], async (req) => {
  // Only Super Admin and Inst. Admin can access
});
```

## 🐛 Common Issues & Solutions

**Issue**: Can't login
- **Solution**: Run `node scripts/create-demo-users.js`

**Issue**: Redirected to unauthorized
- **Solution**: Check user role matches route requirements

**Issue**: Token expired
- **Solution**: Implement refresh token mechanism (already in place)

**Issue**: Session not persisting
- **Solution**: Check cookie settings in browser

## 📈 Next Steps (Week 8)

1. Implement core features with role-based permissions
2. Add permission-based UI rendering
3. Create role-specific functionality
4. Implement audit logging
5. Add activity tracking

---

**Status**: ✅ Week 7 Complete
**Date**: February 15, 2026
**Next**: Week 8 - Core Feature Implementation
