# Week 2 — Database & API Design (SMMS)

## Scope
- Targets: student mentoring workflows, multi-role RBAC, department isolation, auditability, uploads, and analytics seeds.
- Stack decisions: MySQL (MySQLWorkbench), Prisma ORM with SQL migrations, Next.js API Routes, Zod validation, JWT auth with HTTP-only cookies, bcrypt for hashes, S3-compatible storage for files.
- Tenancy model: institution_id optional, department_id required for operational records; mentors/students scoped by department_id; cross-department blocked by default.
- Database: MySQL via MySQLWorkbench (with future migration path to PostgreSQL if needed).

## Entity-Relationship (logical)
```
[institutions] 1—* [departments] 1—* [users] 1—1 [user_profiles]
                                   ├──1 [mentor_profiles]
                                   └──1 [student_profiles]
[roles] 1—* [user_roles] *—1 [users]
[mentor_assignments] *—1 [users (mentor)]
[mentor_assignments] *—1 [users (student)]
[session_records] *—1 [mentor_assignments]
[session_feedback] *—1 [session_records]
[goals] *—1 [users (student)]
[goal_updates] *—1 [goals]
[attachments] *—1 {session_records|session_feedback|goals|mentor_assignments}
[notifications] *—1 [users]
[alerts] *—1 [users (student)]
[audit_logs] *—1 [users]
[password_resets] *—1 [users]
```

## Logical schema (key columns)
- institutions: id (uuid pk), name, code, address, contact_email, created_at.
- departments: id (uuid pk), institution_id fk, name, code, created_at.
- roles: id (smallint pk), name (super_admin, institutional_admin, department_admin, mentor, student).
- users: id (uuid pk), institution_id fk nullable, department_id fk nullable, role_id fk, email (unique), password_hash, status (active/disabled/invited), last_login_at, created_at, updated_at.
- user_profiles: user_id pk/fk, first_name, last_name, phone, avatar_url, title, bio.
- mentor_profiles: user_id pk/fk, designation, specialization, capacity_default, availability_status, max_mentees.
- student_profiles: user_id pk/fk, roll_number (unique within department), program, year_of_study, gpa, attendance_pct, risk_level (low/medium/high).
- mentor_assignments: id (uuid pk), mentor_id fk users, student_id fk users, department_id fk, assigned_by fk users, status (active/paused/ended), assigned_at, ended_at, notes.
- session_records: id (uuid pk), assignment_id fk, session_date, mode (in_person/online/phone), location, topic, summary, action_items jsonb, next_meeting_on, attendance (present/absent), status (scheduled/completed/cancelled), created_by fk users, created_at.
- session_feedback: id (uuid pk), session_id fk, giver_user_id fk, recipient_user_id fk, type (mentor_to_student, student_to_mentor), rating int 1-5, comments, visibility (mentor|student|department_admin), created_at.
- goals: id (uuid pk), student_id fk users, title, category (academic/behavioral/career/wellness), description, target_date, status (not_started/in_progress/at_risk/completed), progress_pct smallint, created_by fk users, created_at.
- goal_updates: id (uuid pk), goal_id fk, noted_by fk users, note, progress_pct, status, created_at.
- attachments: id (uuid pk), related_type (session|feedback|goal|assignment), related_id fk, owner_user_id fk, file_name, mime_type, size_bytes, storage_path, created_at.
- notifications: id (uuid pk), user_id fk, type (session_reminder|goal_due|alert), title, body, payload jsonb, read_at, created_at.
- alerts: id (uuid pk), student_id fk users, severity (info/warn/critical), category (attendance/gpa/behavior/grievance), message, source_ref jsonb, status (open/closed), created_at, closed_at, closed_by fk users.
- audit_logs: id (bigserial pk), user_id fk, action, entity, entity_id, before_state jsonb, after_state jsonb, ip, user_agent, created_at.
- password_resets: id (uuid pk), user_id fk, token_hash, expires_at, used_at, created_at.

Indexes: email unique, roll_number dept scoped unique, composite indexes on mentor_assignments (mentor_id,status), session_records (assignment_id,session_date), alerts (student_id,status), notifications (user_id,read_at).

## API endpoints (Next.js API Routes)
### Auth
- POST /api/auth/register (super_admin, institutional_admin, department_admin) → create user, send invite token.
- POST /api/auth/login → email/password, returns JWT set in HttpOnly cookie.
- POST /api/auth/logout → clear cookie.
- POST /api/auth/refresh → rotate tokens.
- POST /api/auth/password/reset/request → email; creates password_resets row.
- POST /api/auth/password/reset/confirm → token, new password.

### Users and roles
- GET /api/users (admin scopes) → filter by department/role/status; paginated.
- POST /api/users → create user with role, department, profile.
- GET /api/users/:id → profile, role, department.
- PATCH /api/users/:id → update profile, status; role change restricted.
- DELETE /api/users/:id → soft delete/disable.
- GET /api/roles → list roles.

### Departments and institutions
- GET /api/institutions → list
- POST /api/institutions → create (super_admin)
- GET /api/departments → list by institution
- POST /api/departments → create (institutional_admin, super_admin)
- PATCH /api/departments/:id → update

### Mentor-mentee management
- GET /api/mentors → mentor profiles with load stats
- GET /api/mentees → students with risk and summary
- POST /api/assignments → {mentor_id, student_id, department_id}
- GET /api/assignments → filter by mentor_id/student_id/status
- PATCH /api/assignments/:id → status, notes, end date

### Sessions
- POST /api/sessions → create session record under assignment
- GET /api/sessions → filters: mentor_id, student_id, date range, status
- GET /api/sessions/:id → detail including feedback, attachments
- PATCH /api/sessions/:id → update summary, action items, next meeting
- POST /api/sessions/:id/cancel → status cancelled

### Feedback
- POST /api/sessions/:id/feedback → create session_feedback
- GET /api/feedback → filters: recipient_user_id, type

### Goals
- POST /api/students/:id/goals → create goal
- GET /api/students/:id/goals → list
- PATCH /api/goals/:id → update status/progress
- POST /api/goals/:id/updates → add progress note

### Alerts and notifications
- GET /api/alerts → filters: student_id, status
- POST /api/alerts → create alert
- PATCH /api/alerts/:id/close → close alert
- GET /api/notifications → user scoped
- PATCH /api/notifications/:id/read → mark read

### Files
- POST /api/uploads/presign → returns signed URL (S3)
- POST /api/uploads/attach → persist attachments row after upload
- GET /api/attachments/:id → metadata (access-controlled)

### Reports/analytics (read-only)
- GET /api/reports/mentor-load → open assignments per mentor
- GET /api/reports/session-summary → counts and completion
- GET /api/reports/risk → at-risk students list

### Audit
- GET /api/audit → admin-only, filters by entity/user/date

## CRUD mapping
- Users/Profiles/Roles → users, user_profiles, roles, user_roles
- Departments/Institutions → departments, institutions
- Mentor-Mentee pairing → mentor_assignments
- Sessions → session_records, attachments
- Feedback → session_feedback
- Goals → goals, goal_updates
- Alerts → alerts
- Notifications → notifications
- Files → attachments (metadata) + S3 bucket
- Security → password_resets, audit_logs

## Data flow (text)
- Authentication: login → verify bcrypt hash → issue JWT (access + refresh) → set HttpOnly cookie → log audit event.
- Assignment: department_admin posts assignment → create mentor_assignments row → trigger notification to mentor and student → log audit.
- Session lifecycle: mentor creates session → optional attachments → student/mentor add feedback → status completed → next_meeting_on set → notifications scheduled.
- Goal tracking: mentor/student creates goal → goal_updates record progress → alerts generated when status at_risk or past target_date.
- Alerts: system/job checks attendance/gpa thresholds → inserts alerts → notifications to mentors/department admins.

## Validation and constraints
- Email unique, roll_number unique per department.
- FK cascades: on delete user → restrict if referenced by assignment; prefer soft delete (status=disabled).
- JSONB fields validated via Zod before write.
- Enum columns enforced at DB level.

## Migration and seeding plan
- Use Prisma schema with MySQL provider; run `prisma migrate dev` locally, `prisma migrate deploy` in prod.
- Seed roles (5), sample institution, sample department, and two test users (mentor, student) with hashed passwords.
- Database connection via MySQLWorkbench with credentials in .env (DATABASE_URL).
- Migration checklist: backups, apply in staging, smoke-test key endpoints, verify indexes.
- Migration path to PostgreSQL available if needed (schema designed to be portable).

## Security and performance notes
- Enforce department_id scoping in queries; RBAC middleware to check role and scope.
- Rate limit auth endpoints; store refresh tokens as rotating opaque ids with hash (optional table refresh_tokens if implemented later).
- Index heavy-read tables (sessions, assignments, alerts) for date and status filters; prefer pagination with cursor + created_at.
- Enable row-level auditing via audit_logs for user-affecting actions.

## Open questions / assumptions
- Notification transport: in-app only for now; email/SMS out-of-scope per constraints.
- File retention: attachments table assumes S3 lifecycle; no versioning beyond metadata.
- Single role per user stored on users.role_id (user_roles table kept for future multi-role if needed but can remain slim).
