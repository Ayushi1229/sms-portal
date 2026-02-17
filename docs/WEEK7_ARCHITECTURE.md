# Week 7 - Authentication & Authorization Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT BROWSER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────────┐   │
│  │ Login Page     │  │ Auth Context   │  │ Protected Pages     │   │
│  │ /login         │→ │ (useAuth hook) │→ │ Dashboards, etc.    │   │
│  │                │  │                │  │                     │   │
│  │ - Email input  │  │ - user state   │  │ - Admin Dashboard   │   │
│  │ - Password     │  │ - login()      │  │ - Mentor Dashboard  │   │
│  │ - Submit       │  │ - logout()     │  │ - Student Dashboard │   │
│  └────────────────┘  └────────────────┘  └─────────────────────┘   │
│                                                                       │
└───────────────┬───────────────────────────────────────────────────┬─┘
                │                                                   │
                │ HTTP Requests                                     │
                │ (JWT in HttpOnly Cookies)                        │
                ▼                                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS MIDDLEWARE                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  middleware.ts - Route Protection                                    │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  1. Extract JWT token from cookies                           │  │
│  │  2. Verify token signature & expiry                          │  │
│  │  3. Decode user data (id, email, roleId)                     │  │
│  │  4. Check if route requires authentication                   │  │
│  │  5. Check if user's role is allowed for route               │  │
│  │                                                                │  │
│  │  Decision Tree:                                              │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ Is route public (/login, /register)?                    │ │  │
│  │  │   YES → Allow access                                    │ │  │
│  │  │   NO  → Check authentication                           │ │  │
│  │  │           Has valid token?                              │ │  │
│  │  │             NO  → Redirect to /login                    │ │  │
│  │  │             YES → Check role permissions                │ │  │
│  │  │                     Has required role?                  │ │  │
│  │  │                       NO  → Redirect to /unauthorized  │ │  │
│  │  │                       YES → Allow access               │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────┬───────────────────────────────────────────────────┬─┘
                │                                                   │
                │ Authorized Requests                              │
                ▼                                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP ROUTER                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  API Routes      │  │  Server Pages    │  │  Client Pages    │  │
│  │                  │  │                  │  │                  │  │
│  │ /api/auth/login │  │ /dashboard/*     │  │ Uses AuthContext │  │
│  │ /api/auth/me    │  │ - Auto-redirect  │  │ - Protected      │  │
│  │ /api/auth/logout│  │   based on role  │  │   components     │  │
│  │                  │  │ - getCurrentUser│  │ - useAuth hook   │  │
│  │ Protected with   │  │ - Role checking  │  │ - Role checking  │  │
│  │ withRoleAuth()  │  │                  │  │                  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                       │
└───────────────┬───────────────────────────────────────────────────┬─┘
                │                                                   │
                │ Database Queries                                 │
                ▼                                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PRISMA ORM LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  lib/prisma.ts - Database Client                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ - Connection pooling                                          │  │
│  │ - Query optimization                                          │  │
│  │ - Type-safe queries                                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────┬───────────────────────────────────────────────────┬─┘
                │                                                   │
                │ SQL Queries                                      │
                ▼                                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       MySQL DATABASE                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Tables:                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ users        │  │ roles        │  │ user_profiles            │  │
│  ├──────────────┤  ├──────────────┤  ├──────────────────────────┤  │
│  │ id           │  │ id           │  │ userId                   │  │
│  │ email        │  │ name         │  │ firstName                │  │
│  │ passwordHash │  │ description  │  │ lastName                 │  │
│  │ roleId       │  └──────────────┘  │ phone                    │  │
│  │ departmentId │                     │ avatarUrl                │  │
│  │ status       │  Roles:             │ title                    │  │
│  │ createdAt    │  1 - super_admin    └──────────────────────────┘  │
│  └──────────────┘  2 - inst_admin                                   │
│                    3 - dept_admin                                    │
│                    4 - mentor                                        │
│                    5 - student                                       │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Authentication Flow Sequence

```
┌────────┐         ┌────────┐         ┌────────┐         ┌────────┐
│ User   │         │ Client │         │ Server │         │   DB   │
└───┬────┘         └───┬────┘         └───┬────┘         └───┬────┘
    │                  │                  │                  │
    │ 1. Enter email & │                  │                  │
    │    password      │                  │                  │
    ├─────────────────>│                  │                  │
    │                  │ 2. POST /api/    │                  │
    │                  │    auth/login    │                  │
    │                  ├─────────────────>│                  │
    │                  │                  │ 3. Query user    │
    │                  │                  │    by email      │
    │                  │                  ├─────────────────>│
    │                  │                  │ 4. Return user   │
    │                  │                  │    with hash     │
    │                  │                  │<─────────────────┤
    │                  │                  │ 5. Verify        │
    │                  │                  │    password      │
    │                  │                  │    with bcrypt   │
    │                  │                  │                  │
    │                  │                  │ 6. Generate      │
    │                  │                  │    JWT tokens    │
    │                  │                  │                  │
    │                  │ 7. Set cookies   │                  │
    │                  │    + user data   │                  │
    │                  │<─────────────────┤                  │
    │                  │ 8. Redirect to   │                  │
    │                  │    role dashboard│                  │
    │<─────────────────┤                  │                  │
    │                  │                  │                  │
    │ 9. Access        │                  │                  │
    │    dashboard     │                  │                  │
    ├─────────────────>│                  │                  │
    │                  │ 10. Request with │                  │
    │                  │     JWT cookie   │                  │
    │                  ├─────────────────>│                  │
    │                  │                  │ 11. Middleware   │
    │                  │                  │     verifies JWT │
    │                  │                  │                  │
    │                  │                  │ 12. Check role   │
    │                  │                  │     permissions  │
    │                  │                  │                  │
    │                  │ 13. Render page  │                  │
    │                  │<─────────────────┤                  │
    │ 14. Display      │                  │                  │
    │     dashboard    │                  │                  │
    │<─────────────────┤                  │                  │
    │                  │                  │                  │
```

## Role-Based Dashboard Routing

```
┌─────────────────────────────────────────────────────────────┐
│                      Login Successful                        │
│                  (JWT token generated)                       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ Check roleId  │
         └───────┬───────┘
                 │
      ┌──────────┴──────────┐
      │                     │
      ▼                     ▼
┌──────────┐          ┌──────────┐
│ roleId 1 │          │ roleId 2 │
│ or 2     │          │          │
└────┬─────┘          └────┬─────┘
     │                     │
     └──────────┬──────────┘
                │
                ▼
        ┌───────────────┐
        │  /dashboard/  │
        │     admin     │
        └───────────────┘

      ┌──────────┐
      │ roleId 3 │
      └────┬─────┘
           │
           ▼
   ┌───────────────┐
   │  /dashboard/  │
   │  department   │
   └───────────────┘

      ┌──────────┐
      │ roleId 4 │
      └────┬─────┘
           │
           ▼
   ┌───────────────┐
   │  /dashboard/  │
   │    mentor     │
   └───────────────┘

      ┌──────────┐
      │ roleId 5 │
      └────┬─────┘
           │
           ▼
   ┌───────────────┐
   │  /dashboard/  │
   │    student    │
   └───────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Password Security                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ - bcrypt hashing with salt (10 rounds)                 │ │
│ │ - Passwords never stored in plaintext                  │ │
│ │ - Password comparison using bcrypt.compare()           │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Layer 2: Token Security                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ - JWT tokens signed with secret key                    │ │
│ │ - Access tokens expire after 15 minutes                │ │
│ │ - Refresh tokens expire after 7 days                   │ │
│ │ - Tokens stored in HttpOnly cookies                    │ │
│ │ - Secure flag in production (HTTPS only)               │ │
│ │ - SameSite=Strict (CSRF protection)                    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Middleware Protection                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ - Server-side route protection                         │ │
│ │ - Token verification before route access               │ │
│ │ - Role-based access control                            │ │
│ │ - Automatic redirects for unauthorized access          │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Layer 4: API Route Protection                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ - withAuth() wrapper for authentication                │ │
│ │ - withRoleAuth() wrapper for authorization             │ │
│ │ - Per-endpoint role requirements                       │ │
│ │ - Request user injection for access control            │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Layer 5: Database Security                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ - Prisma ORM prevents SQL injection                    │ │
│ │ - Type-safe queries                                     │ │
│ │ - Parameterized queries                                 │ │
│ │ - Foreign key constraints                               │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## File Organization

```
sms-portal/
│
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       ├── page.tsx
│   │       └── LoginForm.tsx ────────┐
│   │                                  │ Uses API
│   ├── (dashboard)/                   │
│   │   ├── layout.tsx                 │
│   │   └── dashboard/                 │
│   │       ├── page.tsx ──────────────┤ Role-based
│   │       ├── admin/page.tsx         │ routing
│   │       ├── department/page.tsx    │
│   │       ├── mentor/page.tsx        │
│   │       └── student/page.tsx       │
│   │                                  │
│   ├── api/                           │
│   │   └── auth/                      │
│   │       ├── login/route.ts ◄───────┘
│   │       ├── logout/route.ts
│   │       ├── me/route.ts
│   │       └── refresh/route.ts
│   │
│   ├── auth-status/
│   │   └── page.tsx ─────────────────┐
│   │                                  │ Helper page
│   └── unauthorized/                  │ for testing
│       └── page.tsx ◄─────────────────┘
│
├── lib/
│   ├── auth/
│   │   ├── index.ts ─────────────────┐
│   │   ├── AuthContext.tsx           │ Core auth
│   │   └── ProtectedComponent.tsx ◄──┤ utilities
│   │                                  │
│   └── middleware/                    │
│       └── auth.ts ◄──────────────────┘
│
├── middleware.ts ◄─── Route protection
│
└── prisma/
    ├── schema.prisma ◄─── Database schema
    └── seed.ts ◄───────── Test users
```

---

This architecture provides:
- ✅ Multiple layers of security
- ✅ Clear separation of concerns
- ✅ Role-based access control
- ✅ Scalable authentication system
- ✅ Production-ready implementation
