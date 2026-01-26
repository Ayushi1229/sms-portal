# Database ER Diagram - Student Mentoring Management System

## Entity-Relationship Overview

This document describes the database schema for the Student Mentoring Management System (SMMS). The system uses MySQL with Prisma ORM.

---

## High-Level ER Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INSTITUTIONAL STRUCTURE                              │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │ institutions │
                    ├──────────────┤
                    │ id (PK)      │
                    │ name         │
                    │ code         │
                    │ address      │
                    │ contactEmail │
                    └──────┬───────┘
                           │ 1
                           │
                           │ *
                    ┌──────┴───────┐
                    │ departments  │
                    ├──────────────┤
                    │ id (PK)      │
                    │ institution  │──FK─→ institutions.id
                    │ name         │
                    │ code         │
                    └──────┬───────┘
                           │ 1
                           │
                           │ *
┌─────────────────────────────────────────────────────────────────────────────┐
│                         USER MANAGEMENT & RBAC                               │
└─────────────────────────────────────────────────────────────────────────────┘

        ┌──────────┐                      ┌─────────────┐
        │  roles   │                      │    users    │
        ├──────────┤                      ├─────────────┤
        │ id (PK)  │ 1                 * │ id (PK)     │
        │ name     │──────────────────────│ institution │──FK─→ institutions.id
        │ desc     │                      │ department  │──FK─→ departments.id
        └──────────┘                      │ role        │──FK─→ roles.id
                                          │ email       │
                                          │ passwordHash│
                                          │ status      │
                                          └──────┬──────┘
                                                 │ 1
                    ┌────────────────────────────┼────────────────────────────┐
                    │ 1                          │ 1                          │ 1
             ┌──────┴──────────┐        ┌───────┴────────┐         ┌─────────┴─────────┐
             │ user_profiles   │        │mentor_profiles │         │ student_profiles  │
             ├─────────────────┤        ├────────────────┤         ├───────────────────┤
             │ userId (PK/FK)  │        │ userId (PK/FK) │         │ userId (PK/FK)    │
             │ firstName       │        │ designation    │         │ rollNumber        │
             │ lastName        │        │ specialization │         │ program           │
             │ phone           │        │ maxMentees     │         │ yearOfStudy       │
             │ avatarUrl       │        │ availability   │         │ gpa               │
             │ title           │        └────────────────┘         │ attendancePct     │
             │ bio             │                                   │ riskLevel         │
             └─────────────────┘                                   └───────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         MENTOR-MENTEE RELATIONSHIPS                          │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌───────────────────┐
                         │mentor_assignments │
                         ├───────────────────┤
                         │ id (PK)           │
                         │ mentor            │──FK─→ users.id (mentor)
                         │ student           │──FK─→ users.id (student)
                         │ department        │──FK─→ departments.id
                         │ assignedBy        │──FK─→ users.id (admin)
                         │ status            │
                         │ assignedAt        │
                         │ endedAt           │
                         │ notes             │
                         └────────┬──────────┘
                                  │ 1
                                  │
                                  │ *
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MENTORING SESSIONS & FEEDBACK                        │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌───────────────────┐
                         │ session_records   │
                         ├───────────────────┤
                         │ id (PK)           │
                         │ assignment        │──FK─→ mentor_assignments.id
                         │ sessionDate       │
                         │ mode              │
                         │ location          │
                         │ topic             │
                         │ summary           │
                         │ actionItems (JSON)│
                         │ nextMeetingOn     │
                         │ attendance        │
                         │ status            │
                         │ createdBy         │──FK─→ users.id
                         └────────┬──────────┘
                                  │ 1
                                  │
                                  │ *
                         ┌────────┴──────────┐
                         │session_feedback   │
                         ├───────────────────┤
                         │ id (PK)           │
                         │ session           │──FK─→ session_records.id
                         │ giverUser         │──FK─→ users.id
                         │ recipientUser     │──FK─→ users.id
                         │ type              │
                         │ rating (1-5)      │
                         │ comments          │
                         │ visibility        │
                         └───────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         GOALS & PROGRESS TRACKING                            │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌───────────────────┐
                         │      goals        │
                         ├───────────────────┤
                         │ id (PK)           │
                         │ student           │──FK─→ users.id
                         │ title             │
                         │ category          │
                         │ description       │
                         │ targetDate        │
                         │ status            │
                         │ progressPct       │
                         │ createdBy         │──FK─→ users.id
                         └────────┬──────────┘
                                  │ 1
                                  │
                                  │ *
                         ┌────────┴──────────┐
                         │  goal_updates     │
                         ├───────────────────┤
                         │ id (PK)           │
                         │ goal              │──FK─→ goals.id
                         │ notedBy           │──FK─→ users.id
                         │ note              │
                         │ progressPct       │
                         │ status            │
                         └───────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    NOTIFICATIONS, ALERTS & ATTACHMENTS                       │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
    │notifications │         │    alerts    │         │ attachments  │
    ├──────────────┤         ├──────────────┤         ├──────────────┤
    │ id (PK)      │         │ id (PK)      │         │ id (PK)      │
    │ user         │─FK→users│ student      │─FK→users│ relatedType  │
    │ type         │         │ severity     │         │ relatedId    │
    │ title        │         │ category     │         │ ownerUser    │─FK→users
    │ body         │         │ message      │         │ fileName     │
    │ payload(JSON)│         │ sourceRef    │         │ mimeType     │
    │ readAt       │         │ status       │         │ sizeBytes    │
    └──────────────┘         │ closedAt     │         │ storagePath  │
                             │ closedBy     │─FK→users└──────────────┘
                             └──────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         SECURITY & AUDIT                                     │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐              ┌──────────────────┐
    │   audit_logs     │              │password_resets   │
    ├──────────────────┤              ├──────────────────┤
    │ id (PK)          │              │ id (PK)          │
    │ user             │──FK─→ users  │ user             │──FK─→ users
    │ action           │              │ tokenHash        │
    │ entity           │              │ expiresAt        │
    │ entityId         │              │ usedAt           │
    │ beforeState(JSON)│              └──────────────────┘
    │ afterState (JSON)│
    │ ip               │
    │ userAgent        │
    └──────────────────┘
```

---

## Table Relationships Summary

### One-to-Many Relationships

| Parent Table | Child Table | Relationship |
|--------------|-------------|--------------|
| institutions | departments | 1 institution → many departments |
| departments | users | 1 department → many users |
| institutions | users | 1 institution → many users |
| roles | users | 1 role → many users |
| users | user_profiles | 1 user → 1 profile |
| users | mentor_profiles | 1 mentor → 1 mentor_profile |
| users | student_profiles | 1 student → 1 student_profile |
| mentor_assignments | session_records | 1 assignment → many sessions |
| session_records | session_feedback | 1 session → many feedback entries |
| users (student) | goals | 1 student → many goals |
| goals | goal_updates | 1 goal → many updates |
| users | notifications | 1 user → many notifications |
| users (student) | alerts | 1 student → many alerts |
| users | audit_logs | 1 user → many audit logs |
| users | password_resets | 1 user → many reset tokens |

### Many-to-Many (through Junction Tables)

| Entity 1 | Junction Table | Entity 2 | Description |
|----------|----------------|----------|-------------|
| users (mentor) | mentor_assignments | users (student) | Mentors assigned to students |

### Polymorphic Relationships

| Polymorphic Table | Related Tables | Notes |
|-------------------|----------------|-------|
| attachments | session_records, session_feedback, goals, mentor_assignments | Files can be attached to multiple entity types |

---

## Key Indexes

### Performance Indexes

```sql
-- User lookups
users(email)                           -- Unique index for login
users(roleId, departmentId)            -- Role-based queries

-- Student profile lookups
student_profiles(rollNumber)           -- Unique index

-- Mentor assignments
mentor_assignments(mentorId, status)   -- Mentor's active assignments
mentor_assignments(studentId, status)  -- Student's active assignments

-- Session queries
session_records(assignmentId, sessionDate)  -- Session history
session_records(status, sessionDate)        -- Pending/scheduled sessions

-- Alerts and notifications
alerts(studentId, status)              -- Active alerts per student
notifications(userId, readAt)          -- Unread notifications

-- Audit trail
audit_logs(entity, entityId)           -- Entity audit history
audit_logs(createdAt)                  -- Chronological audit
```

---

## Data Integrity Constraints

### Foreign Key Constraints

- **CASCADE**: Used for dependent data (profiles, session feedback)
- **RESTRICT**: Used to prevent deletion of referenced entities (roles, assignments)
- **SET NULL**: Used for optional references (closed alerts, institution refs)

### Unique Constraints

- `institutions.code` - Institution code must be unique
- `departments(institutionId, code)` - Department code unique per institution
- `users.email` - Email must be unique across all users
- `student_profiles.rollNumber` - Roll number must be unique

### Check Constraints (via Enums)

- `UserStatus`: ACTIVE, DISABLED, INVITED
- `RiskLevel`: LOW, MEDIUM, HIGH
- `AssignmentStatus`: ACTIVE, PAUSED, ENDED
- `SessionMode`: IN_PERSON, ONLINE, PHONE
- `SessionStatus`: SCHEDULED, COMPLETED, CANCELLED
- `GoalStatus`: NOT_STARTED, IN_PROGRESS, AT_RISK, COMPLETED
- `AlertSeverity`: INFO, WARN, CRITICAL

---

## Database Statistics (Post-Seed)

| Table | Expected Rows | Notes |
|-------|---------------|-------|
| roles | 5 | Fixed roles |
| institutions | 1+ | One per installation |
| departments | 3+ | Multiple per institution |
| users | 5+ | Grows with system usage |
| mentor_assignments | 2+ | Active pairings |
| session_records | 100s-1000s | Historical sessions |
| goals | 10s-100s | Active student goals |
| notifications | 1000s+ | High-volume |
| alerts | 10s-100s | Active at-risk alerts |
| audit_logs | 10000s+ | Compliance trail |

---

## Migration Strategy

### Phase 1: Core Structure (Week 2)
- ✅ Institutions and departments
- ✅ Users, roles, and profiles
- ✅ Authentication tables

### Phase 2: Mentoring Features (Week 6-8)
- ✅ Mentor assignments
- ✅ Session records and feedback
- ✅ Goals and progress tracking

### Phase 3: System Features (Week 9-10)
- ✅ Notifications and alerts
- ✅ Attachments and file management
- ✅ Audit logs

---

## Future Considerations

### Potential Schema Extensions

1. **Multi-role per user**: Expand `user_roles` junction table (currently simplified)
2. **Email templates**: Add `email_templates` table for notification emails
3. **Report cache**: Add `cached_reports` for performance
4. **Attendance tracking**: Dedicated `attendance_records` table
5. **Announcement system**: Add `announcements` table for broadcasts
6. **Chat/messaging**: Add `messages` and `conversations` tables

### Migration to PostgreSQL

The schema is designed to be portable:
- Uses standard SQL types
- Avoids MySQL-specific features where possible
- JSON columns supported in both MySQL and PostgreSQL
- Enums map cleanly to PostgreSQL ENUMs

Migration steps documented in [DATABASE_SETUP.md](./DATABASE_SETUP.md#migration-to-postgresql-future)

---

## ER Diagram Tools

To visualize this schema:

### Using Prisma Studio
```bash
npm run db:studio
```

### Using MySQLWorkbench
1. Connect to database
2. Database → Reverse Engineer
3. Select `smms_dev` database
4. View auto-generated ER diagram

### Using dbdiagram.io
- Export schema to DBML format
- Import to https://dbdiagram.io for visual editing

### Using SchemaSpy
```bash
docker run -v "$PWD:/output" schemaspy/schemaspy:latest \
  -t mysql -host localhost:3306 -db smms_dev -u smms_user -p password
```

---

**Last Updated**: January 25, 2026  
**Schema Version**: 1.0.0  
**Total Tables**: 18  
**Total Relationships**: 30+
