# Week 3 — Routing Structure Documentation (SMMS)

## Overview
This document outlines the complete routing structure for the Student Mentoring Management System using Next.js 16 App Router. Routes are organized by feature area and role-based access.

---

## Route Architecture

### Route Groups
- `(auth)` - Public authentication routes
- `(dashboard)` - Protected dashboard routes with role-based access
- `(admin)` - Admin-only routes (nested under dashboard)

---

## Complete Route Map

### 1. Authentication Routes (`/`)
**Layout**: Minimal layout without navigation

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/login` | `app/(auth)/login/page.tsx` | Public | Role-based login |
| `/register` | `app/(auth)/register/page.tsx` | Public | New user registration |
| `/forgot-password` | `app/(auth)/forgot-password/page.tsx` | Public | Password reset request |
| `/reset-password` | `app/(auth)/reset-password/page.tsx` | Public | Password reset confirmation |
| `/setup-account` | `app/(auth)/setup-account/page.tsx` | Public | First-time account setup with invite token |

---

### 2. Dashboard Routes (`/dashboard`)
**Layout**: Full layout with navbar and sidebar

#### 2.1 Role-Based Dashboards

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | All Authenticated | Redirects to role-specific dashboard |
| `/dashboard/admin` | `app/(dashboard)/dashboard/admin/page.tsx` | super_admin, institutional_admin | System-wide overview, alerts, metrics |
| `/dashboard/department` | `app/(dashboard)/dashboard/department/page.tsx` | department_admin | Department-level metrics |
| `/dashboard/mentor` | `app/(dashboard)/dashboard/mentor/page.tsx` | mentor | Mentee list, upcoming meetings, alerts |
| `/dashboard/student` | `app/(dashboard)/dashboard/student/page.tsx` | student | Mentor info, feedback, progress |

---

### 3. User Management Routes (`/users`)
**Access**: Admin roles only

#### 3.1 User CRUD

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/users` | `app/(dashboard)/users/page.tsx` | Admin | List all users with filters |
| `/users/new` | `app/(dashboard)/users/new/page.tsx` | Admin | Create new user |
| `/users/[id]` | `app/(dashboard)/users/[id]/page.tsx` | Admin, Own Profile | View user details |
| `/users/[id]/edit` | `app/(dashboard)/users/[id]/edit/page.tsx` | Admin, Own Profile | Edit user profile |

#### 3.2 Mentor Management

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/mentors` | `app/(dashboard)/mentors/page.tsx` | Admin | List mentors with stats |
| `/mentors/new` | `app/(dashboard)/mentors/new/page.tsx` | Admin | Add mentor profile |
| `/mentors/[id]` | `app/(dashboard)/mentors/[id]/page.tsx` | Admin, Mentor | Mentor profile details |
| `/mentors/[id]/edit` | `app/(dashboard)/mentors/[id]/edit/page.tsx` | Admin, Own | Edit mentor profile |

#### 3.3 Student Management

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/students` | `app/(dashboard)/students/page.tsx` | Admin, Mentor | List students with filters |
| `/students/new` | `app/(dashboard)/students/new/page.tsx` | Admin | Add student profile |
| `/students/[id]` | `app/(dashboard)/students/[id]/page.tsx` | Admin, Mentor, Own | Student profile details |
| `/students/[id]/edit` | `app/(dashboard)/students/[id]/edit/page.tsx` | Admin, Own | Edit student profile |
| `/students/[id]/goals` | `app/(dashboard)/students/[id]/goals/page.tsx` | Mentor, Student | View/manage student goals |

#### 3.4 Bulk Operations

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/users/import` | `app/(dashboard)/users/import/page.tsx` | Admin | Bulk import users (Excel) |
| `/users/import/template` | API endpoint | Admin | Download Excel template |

#### 3.5 Assignments

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/assignments` | `app/(dashboard)/assignments/page.tsx` | Admin | List mentor-student assignments |
| `/assignments/new` | `app/(dashboard)/assignments/new/page.tsx` | department_admin | Create assignment |
| `/assignments/[id]` | `app/(dashboard)/assignments/[id]/page.tsx` | Admin, Mentor | Assignment details |
| `/assignments/[id]/edit` | `app/(dashboard)/assignments/[id]/edit/page.tsx` | department_admin | Edit assignment |

#### 3.6 Role & Permission Management

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/roles` | `app/(dashboard)/roles/page.tsx` | super_admin | List roles |
| `/roles/[id]` | `app/(dashboard)/roles/[id]/page.tsx` | super_admin | Role details |
| `/permissions` | `app/(dashboard)/permissions/page.tsx` | super_admin | Permission management |

---

### 4. Mentoring Session Routes (`/sessions`)

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/sessions` | `app/(dashboard)/sessions/page.tsx` | Mentor, Student | List sessions with filters |
| `/sessions/schedule` | `app/(dashboard)/sessions/schedule/page.tsx` | Mentor | Schedule new session |
| `/sessions/[id]` | `app/(dashboard)/sessions/[id]/page.tsx` | Mentor, Student | Session details |
| `/sessions/[id]/edit` | `app/(dashboard)/sessions/[id]/edit/page.tsx` | Mentor | Edit session record |
| `/sessions/[id]/feedback` | `app/(dashboard)/sessions/[id]/feedback/page.tsx` | Mentor, Student | Add feedback to session |
| `/sessions/[id]/documents` | `app/(dashboard)/sessions/[id]/documents/page.tsx` | Mentor, Student | Upload/view documents |
| `/sessions/history` | `app/(dashboard)/sessions/history/page.tsx` | Mentor, Student | View session history |
| `/sessions/calendar` | `app/(dashboard)/sessions/calendar/page.tsx` | Mentor, Student | Calendar view of sessions |

---

### 5. Feedback & Remarks Routes (`/feedback`)

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/feedback` | `app/(dashboard)/feedback/page.tsx` | All | List feedback |
| `/feedback/mentor` | `app/(dashboard)/feedback/mentor/page.tsx` | Mentor | Mentor feedback dashboard |
| `/feedback/student` | `app/(dashboard)/feedback/student/page.tsx` | Student | Student feedback dashboard |
| `/feedback/[id]` | `app/(dashboard)/feedback/[id]/page.tsx` | Relevant users | Feedback details |
| `/feedback/summary` | `app/(dashboard)/feedback/summary/page.tsx` | Mentor, Admin | Summary reports per student |
| `/feedback/reviews/monthly` | `app/(dashboard)/feedback/reviews/monthly/page.tsx` | Admin | Monthly review reports |
| `/feedback/reviews/semester` | `app/(dashboard)/feedback/reviews/semester/page.tsx` | Admin | Semester review reports |

---

### 6. Goals & Progress Routes (`/goals`)

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/goals` | `app/(dashboard)/goals/page.tsx` | Student, Mentor | List goals |
| `/goals/new` | `app/(dashboard)/goals/new/page.tsx` | Mentor, Student | Create new goal |
| `/goals/[id]` | `app/(dashboard)/goals/[id]/page.tsx` | Mentor, Student | Goal details |
| `/goals/[id]/edit` | `app/(dashboard)/goals/[id]/edit/page.tsx` | Mentor, Student | Edit goal |
| `/goals/[id]/updates` | `app/(dashboard)/goals/[id]/updates/page.tsx` | Mentor, Student | View/add progress updates |

---

### 7. Alerts & Notifications Routes (`/alerts`)

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/alerts` | `app/(dashboard)/alerts/page.tsx` | Mentor, Admin | List student alerts |
| `/alerts/[id]` | `app/(dashboard)/alerts/[id]/page.tsx` | Mentor, Admin | Alert details |
| `/notifications` | `app/(dashboard)/notifications/page.tsx` | All | User notifications |
| `/notifications/settings` | `app/(dashboard)/notifications/settings/page.tsx` | All | Notification preferences |

---

### 8. Reports & Analytics Routes (`/reports`)

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/reports` | `app/(dashboard)/reports/page.tsx` | Admin, Mentor | Reports dashboard |
| `/reports/mentor-load` | `app/(dashboard)/reports/mentor-load/page.tsx` | Admin | Mentor workload report |
| `/reports/mentee-summary` | `app/(dashboard)/reports/mentee-summary/page.tsx` | Admin, Mentor | Mentor-wise mentee report |
| `/reports/student-progress` | `app/(dashboard)/reports/student-progress/page.tsx` | Admin, Mentor | Student progress report |
| `/reports/department-summary` | `app/(dashboard)/reports/department-summary/page.tsx` | Admin | Department-wise summary |
| `/reports/pending-sessions` | `app/(dashboard)/reports/pending-sessions/page.tsx` | Admin, Mentor | Pending sessions report |
| `/reports/attendance` | `app/(dashboard)/reports/attendance/page.tsx` | Admin | Attendance analytics |
| `/reports/risk-analysis` | `app/(dashboard)/reports/risk-analysis/page.tsx` | Admin, Mentor | At-risk students |
| `/reports/export` | `app/(dashboard)/reports/export/page.tsx` | Admin | Export to Excel/PDF |

---

### 9. Departments & Institutions Routes (`/departments`)

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/departments` | `app/(dashboard)/departments/page.tsx` | Admin | List departments |
| `/departments/new` | `app/(dashboard)/departments/new/page.tsx` | institutional_admin | Create department |
| `/departments/[id]` | `app/(dashboard)/departments/[id]/page.tsx` | Admin | Department details |
| `/departments/[id]/edit` | `app/(dashboard)/departments/[id]/edit/page.tsx` | institutional_admin | Edit department |
| `/institutions` | `app/(dashboard)/institutions/page.tsx` | super_admin | List institutions |
| `/institutions/new` | `app/(dashboard)/institutions/new/page.tsx` | super_admin | Create institution |
| `/institutions/[id]` | `app/(dashboard)/institutions/[id]/page.tsx` | super_admin | Institution details |

---

### 10. Settings & Profile Routes (`/settings`)

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/settings/profile` | `app/(dashboard)/settings/profile/page.tsx` | All | User profile settings |
| `/settings/password` | `app/(dashboard)/settings/password/page.tsx` | All | Change password |
| `/settings/preferences` | `app/(dashboard)/settings/preferences/page.tsx` | All | User preferences |
| `/settings/security` | `app/(dashboard)/settings/security/page.tsx` | All | Security settings |
| `/settings/system` | `app/(dashboard)/settings/system/page.tsx` | super_admin | System configuration |

---

### 11. Audit & Logs Routes (`/audit`)

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/audit` | `app/(dashboard)/audit/page.tsx` | super_admin | Audit logs |
| `/audit/users` | `app/(dashboard)/audit/users/page.tsx` | super_admin | User activity logs |
| `/audit/sessions` | `app/(dashboard)/audit/sessions/page.tsx` | Admin | Session audit trail |
| `/audit/export` | `app/(dashboard)/audit/export/page.tsx` | super_admin | Export audit logs |

---

### 12. File Management Routes (`/files`)

| Path | File | Access | Purpose |
|------|------|--------|---------|
| `/files` | `app/(dashboard)/files/page.tsx` | All | List uploaded files |
| `/files/upload` | `app/(dashboard)/files/upload/page.tsx` | All | File upload interface |
| `/files/[id]` | `app/(dashboard)/files/[id]/page.tsx` | Relevant users | File details/preview |

---

## Special Routes

### API Routes (`/api`)
All API routes are defined in [docs/API_ENDPOINTS.md](./API_ENDPOINTS.md)

### Error Pages

| Path | File | Purpose |
|------|------|---------|
| `/not-found` | `app/not-found.tsx` | 404 error page |
| `/error` | `app/error.tsx` | Global error boundary |
| `/unauthorized` | `app/unauthorized/page.tsx` | 403 access denied |

### Loading States

| Path | File | Purpose |
|------|------|---------|
| `/loading` | `app/loading.tsx` | Global loading state |
| `/dashboard/loading` | `app/(dashboard)/loading.tsx` | Dashboard loading |

---

## Route Protection Strategy

### Middleware (`middleware.ts`)
```typescript
// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/users', '/sessions', '/reports', ...]

// Public routes accessible without authentication
const publicRoutes = ['/login', '/register', '/forgot-password', ...]

// Role-based route access
const roleRoutes = {
  super_admin: ['/*'],
  institutional_admin: ['/dashboard/admin', '/departments', '/users', ...],
  department_admin: ['/dashboard/department', '/assignments', ...],
  mentor: ['/dashboard/mentor', '/sessions', '/students', ...],
  student: ['/dashboard/student', '/sessions', '/feedback', ...]
}
```

---

## Layout Hierarchy

```
app/
├── layout.tsx                    # Root layout (global providers, fonts)
├── (auth)/
│   └── layout.tsx                # Auth layout (centered, minimal)
└── (dashboard)/
    └── layout.tsx                # Dashboard layout (navbar + sidebar)
```

---

## Navigation Components Structure

### Navbar Component
- Logo/branding
- Search bar
- Notifications dropdown
- User profile dropdown
- Role indicator

### Sidebar Component
**Dynamic menu based on role:**

#### Super Admin
- Dashboard
- Institutions
- Departments
- Users
- Roles & Permissions
- Audit Logs
- Reports
- Settings

#### Department Admin
- Dashboard
- Mentors
- Students
- Assignments
- Sessions
- Reports
- Settings

#### Mentor
- Dashboard
- My Mentees
- Sessions
- Feedback
- Goals
- Alerts
- Settings

#### Student
- Dashboard
- My Mentor
- Sessions
- Feedback
- My Goals
- Settings

---

## Route Naming Conventions

1. **Plurals for lists**: `/users`, `/sessions`, `/reports`
2. **Singular for single resource**: `/user/[id]`, `/session/[id]`
3. **Nested resources**: `/students/[id]/goals`
4. **Actions as routes**: `/sessions/schedule`, `/users/import`
5. **Dynamic segments**: `[id]`, `[userId]`, `[sessionId]`

---

## Redirect Rules

| From | To | Condition |
|------|-------|-----------|
| `/` | `/dashboard` | Authenticated |
| `/` | `/login` | Not authenticated |
| `/dashboard` | `/dashboard/admin` | super_admin |
| `/dashboard` | `/dashboard/mentor` | mentor |
| `/dashboard` | `/dashboard/student` | student |

---

## Breadcrumb Structure

All dashboard pages include breadcrumbs:
```
Dashboard > Users > Edit User
Dashboard > Sessions > Schedule Session
Dashboard > Reports > Student Progress
```

---

## Total Route Count

| Category | Count |
|----------|-------|
| Auth Routes | 5 |
| Dashboard Routes | 5 |
| User Management | 15 |
| Session Management | 8 |
| Feedback Routes | 7 |
| Goals Routes | 5 |
| Alerts Routes | 4 |
| Reports Routes | 9 |
| Departments/Institutions | 7 |
| Settings Routes | 5 |
| Audit Routes | 4 |
| File Management | 3 |
| **Total** | **77** |

---

## Next Steps (Week 4-5)

1. Implement UI components for each page
2. Add form handling and validation
3. Connect to API endpoints
4. Implement role-based rendering
5. Add loading and error states
6. Implement search and filters
7. Add pagination components

---

**Last Updated**: January 25, 2026  
**Week**: 3 - Routing Structure  
**Status**: Complete - Ready for UI implementation
