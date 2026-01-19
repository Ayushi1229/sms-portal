# User Roles and Permissions Documentation - SMMS

## Overview
This document defines the user roles, responsibilities, and permissions for the Student Mentoring Management System (SMMS). Role-Based Access Control (RBAC) ensures that users can only access features and data appropriate to their role and organizational context.

---

## Role Hierarchy

```
┌──────────────────────────────┐
│   System Administrator       │
│  (Super Admin - Full Access) │
└──────────────┬───────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───┴──────────┐   ┌──────┴────────┐
│Department    │   │Institutional   │
│Administrator │   │Administrator   │
└───┬──────────┘   └──────┬────────┘
    │                     │
    └──────────┬──────────┘
               │
    ┌──────────┴──────────────────┐
    │                             │
┌───┴─────────┐         ┌────────┴──┐
│   Mentor    │         │  Student   │
│ (Faculty)   │         │  (Mentee)  │
└─────────────┘         └────────────┘
```

---

## 1. System Administrator (Super Admin)

### Description
System Administrator has unrestricted access to all platform features. Typically assigned to IT administrators or senior institutional staff. Manages platform configuration, user accounts, and overall system health.

### Responsibilities
- System configuration and maintenance
- Role and permission management
- User account lifecycle management
- Department and institutional setup
- System monitoring and performance
- Data backup and recovery
- Security policies enforcement
- Audit log management

### Permissions

#### User Management
- ✅ Create users of any role (Admin, Mentor, Student, Department)
- ✅ Edit all user profiles
- ✅ Delete users
- ✅ Reset user passwords
- ✅ Assign/Change user roles
- ✅ Enable/Disable user accounts
- ✅ Bulk import users (Excel)
- ✅ View all login audit logs

#### Institutional Setup
- ✅ Configure system parameters
- ✅ Manage departments and colleges
- ✅ Set up academic calendars
- ✅ Configure system email/notification settings
- ✅ Manage backup schedules

#### Data Management
- ✅ View all data regardless of user/department
- ✅ Export all system data
- ✅ Delete any records
- ✅ Modify any records
- ✅ Access all audit logs
- ✅ Generate compliance reports

#### Dashboard & Analytics
- ✅ Access complete system dashboard
- ✅ View all mentoring metrics
- ✅ Generate all types of reports
- ✅ Monitor system performance

---

## 2. Institutional Administrator

### Description
Manages institutional-level mentoring programs and policies. Oversees multiple departments and generates institutional reports. Approves department policies and monitors overall mentoring effectiveness.

### Responsibilities
- Institutional policy formulation
- Department oversight and coordination
- Institutional reporting and analytics
- Mentor-mentee matching at institutional level
- Cross-department mentoring coordination
- Institutional compliance and accreditation

### Permissions

#### User Management
- ✅ Create Admin and Mentor accounts (within their institution)
- ✅ Create and manage Department Administrators
- ✅ View all users in institution
- ✅ Edit user profiles (limited)
- ✅ Reset passwords for users
- ✅ Enable/Disable accounts
- ❌ Cannot create system administrators
- ❌ Cannot modify their own role

#### Department Management
- ✅ Create departments
- ✅ Configure department settings
- ✅ Assign Department Admins
- ✅ View department performance
- ❌ Cannot delete departments without review

#### Data Management
- ✅ View all institutional mentoring data
- ✅ Export institutional data
- ✅ Access institutional audit trails
- ✅ View cross-department metrics
- ❌ Cannot view personal sensitive data

#### Dashboard & Analytics
- ✅ Access institutional dashboard
- ✅ View all institutional metrics
- ✅ Generate institutional reports
- ✅ Create custom reports

---

## 3. Department Administrator

### Description
Manages mentoring programs within their department. Handles mentor-mentee assignments, approves sessions, and generates department reports. Reports to Institutional Administrator.

### Responsibilities
- Department mentoring program management
- Mentor and student enrollment
- Mentor-mentee matching and assignment
- Department level monitoring
- Department reporting
- Budget and resource allocation

### Permissions

#### User Management
- ✅ Create Mentor and Student accounts (within department)
- ✅ View department users
- ✅ Edit user profiles (within department)
- ✅ Reset student/mentor passwords (within department)
- ✅ Bulk import users (department)
- ✅ Assign mentors to students (within department)
- ✅ Enable/Disable departmental accounts
- ❌ Cannot create admins
- ❌ Cannot view other departments' data

#### Session Management
- ✅ View all sessions in department
- ✅ Approve/Reject sessions
- ✅ View session details
- ✅ Generate session reports
- ❌ Cannot edit mentor-recorded sessions

#### Data Management
- ✅ View all departmental mentoring data
- ✅ Export department data
- ✅ View department audit trails
- ✅ View mentee progress reports
- ❌ Cannot view sensitive personal data beyond role

#### Dashboard & Analytics
- ✅ Access department dashboard
- ✅ View department metrics
- ✅ Generate department reports
- ✅ Monitor mentor workload
- ✅ Identify at-risk students
- ❌ Cannot view other departments

---

## 4. Mentor (Faculty)

### Description
Faculty members assigned to mentor students. Conduct mentoring sessions, provide feedback, track student progress, and document interactions. Can view only their assigned mentees' information.

### Responsibilities
- Conduct regular mentoring sessions
- Track mentee academic and personal progress
- Provide feedback on student development
- Record session details and action items
- Monitor mentee attendance and behavior
- Identify and report at-risk students
- Participate in institutional mentoring initiatives

### Permissions

#### Student Management
- ✅ View assigned mentees' profiles
- ✅ View mentee academic records
- ✅ View mentee attendance
- ✅ View mentee feedback history
- ✅ Add notes to mentee profiles
- ❌ Cannot edit student profiles
- ❌ Cannot view unassigned students
- ❌ Cannot create users

#### Session Management
- ✅ Schedule mentoring sessions
- ✅ Record session details (topics, summary, action points)
- ✅ Upload session documents
- ✅ View session history
- ✅ Set next meeting dates
- ✅ Provide feedback on student progress
- ✅ Mark sessions as completed

#### Feedback & Reporting
- ✅ Provide mentor feedback
- ✅ Generate feedback summaries
- ✅ Monthly performance reports
- ✅ Semester reviews
- ✅ Record grievances and interventions
- ✅ Flag at-risk students

#### Dashboard & Analytics
- ✅ Access mentee dashboard
- ✅ View own mentee metrics
- ✅ View mentee progress reports
- ✅ Upcoming meeting schedule
- ✅ Performance alerts
- ❌ Cannot view other mentors' data

#### Communication
- ✅ Send messages to mentees
- ✅ Receive mentee messages
- ✅ Share documents with mentees
- ✅ Set meeting reminders

---

## 5. Student (Mentee)

### Description
Students assigned to mentors. Access mentoring resources, view feedback, track progress, and provide feedback on mentoring relationship. Limited access to their own data and mentor information.

### Responsibilities
- Attend scheduled mentoring sessions
- Participate actively in mentoring relationship
- Provide feedback on mentoring received
- Track personal academic and development goals
- Communicate with mentor regularly
- Review and act on feedback

### Permissions

#### Profile & Personal Data
- ✅ View own profile and academic records
- ✅ View own mentee goals
- ✅ Update own contact information
- ✅ Change own password
- ❌ Cannot view other students' data
- ❌ Cannot edit academic records

#### Mentoring Relationship
- ✅ View assigned mentor's profile
- ✅ View mentor's contact information
- ✅ View past mentoring sessions
- ✅ View action items from sessions
- ✅ View mentor feedback
- ✅ Provide feedback on mentoring
- ✅ Schedule sessions (request)
- ❌ Cannot view mentor's other mentees

#### Feedback & Reporting
- ✅ Provide feedback on mentoring
- ✅ View mentoring summaries
- ✅ View progress reports
- ✅ Report grievances
- ❌ Cannot generate institutional reports

#### Dashboard & Analytics
- ✅ Access personal dashboard
- ✅ View own progress metrics
- ✅ View session history
- ✅ View feedback received
- ✅ Track goal progress
- ❌ Cannot view system-wide analytics

#### Communication
- ✅ Send messages to mentor
- ✅ Receive mentor messages
- ✅ Receive documents from mentor
- ✅ Receive meeting reminders

---

## Permission Matrix

| Feature | Super Admin | Institutional Admin | Department Admin | Mentor | Student |
|---------|:-----------:|:------------------:|:----------------:|:------:|:-------:|
| **User Management** | | | | | |
| Create All Users | ✅ | ⚠️ Limited | ⚠️ Dept Only | ❌ | ❌ |
| Edit User Profiles | ✅ | ✅ | ⚠️ Dept Only | ❌ | ⚠️ Self |
| Delete Users | ✅ | ✅ | ⚠️ Dept Only | ❌ | ❌ |
| Bulk Import Users | ✅ | ✅ | ⚠️ Dept Only | ❌ | ❌ |
| Reset Passwords | ✅ | ✅ | ✅ | ❌ | ⚠️ Self |
| **Mentor-Mentee Management** | | | | | |
| Assign Mentors | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Mentees | ✅ | ✅ | ✅ | ✅ | ❌ |
| View Mentor Info | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Session Management** | | | | | |
| Schedule Sessions | ✅ | ✅ | ✅ | ✅ | ⚠️ Request |
| Record Sessions | ✅ | ✅ | ✅ | ✅ | ❌ |
| View Session History | ✅ | ✅ | ✅ | ✅ | ✅ |
| Upload Documents | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Feedback & Reports** | | | | | |
| Give Feedback | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Feedback | ✅ | ✅ | ✅ | ✅ | ✅ |
| Generate Reports | ✅ | ✅ | ✅ | ✅ | ⚠️ Own Only |
| Export Data | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Dashboard & Analytics** | | | | | |
| System Dashboard | ✅ | ❌ | ❌ | ❌ | ❌ |
| Institutional Dashboard | ✅ | ✅ | ❌ | ❌ | ❌ |
| Department Dashboard | ✅ | ✅ | ✅ | ❌ | ❌ |
| Mentor Dashboard | ✅ | ✅ | ✅ | ✅ | ❌ |
| Student Dashboard | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Configuration** | | | | | |
| System Config | ✅ | ❌ | ❌ | ❌ | ❌ |
| Department Config | ✅ | ✅ | ✅ | ❌ | ❌ |
| Audit Logs | ✅ | ✅ | ⚠️ Dept Only | ❌ | ❌ |

**Legend:** ✅ = Full Access | ⚠️ = Limited/Conditional | ❌ = No Access

---

## Data Access Scope

### Super Admin
- Access: All data across all institutions and departments

### Institutional Admin
- Scope: Own institution only
- Data: All institutional mentoring data, cross-departmental metrics

### Department Admin
- Scope: Own department only
- Data: Department mentors, students, sessions, feedback
- Restrictions: Cannot view students' sensitive personal data

### Mentor
- Scope: Assigned mentees only
- Data: Own mentees' academic records, feedback, sessions
- Restrictions: Cannot view other mentors' data or unassigned students

### Student
- Scope: Own data and assigned mentor only
- Data: Own profile, mentor information, feedback, sessions
- Restrictions: Cannot view other students' data

---

## Security Considerations

### Password Policy by Role
- **System Admin**:
  - Minimum 16 characters
  - Required: uppercase, lowercase, numbers, special characters
  - Expiration: 60 days
  - MFA required
  
- **Institutional/Department Admin**:
  - Minimum 12 characters
  - Required: uppercase, lowercase, numbers, special characters
  - Expiration: 90 days
  - MFA recommended
  
- **Mentor/Student**:
  - Minimum 8 characters
  - Expiration: 180 days
  - MFA optional

### Session Management
- **System Admin**: 30-minute timeout
- **Institutional Admin**: 1-hour timeout
- **Department Admin**: 1-hour timeout
- **Mentor**: 4-hour timeout
- **Student**: 8-hour timeout

### Audit Logging
All role-related actions logged including:
- Login/logout
- Role/permission changes
- Data access
- Session creation/modification
- Report generation
- User management actions

---

## Department-Based Data Isolation

The system implements strict department-level data isolation:

### Mentor Data Access
- Can only access mentees assigned within their department
- Cannot view cross-departmental mentee data
- Cannot see other mentors' sessions

### Student Data Access
- Can only view own data
- Can access assigned mentor's information
- Cannot access institution-level analytics

### Admin Data Access
- Department Admins see only their department
- Cannot access other departments' data
- Institutional Admins see all departmental data
- Super Admin has unrestricted access

---

## Special Cases and Scenarios

### Scenario 1: Cross-Department Mentoring
If institutional mentoring requires cross-department assignment:
1. Institutional Admin must explicitly approve
2. Department Admin of both departments notified
3. Full audit trail maintained
4. Both departments see relevant data

### Scenario 2: Mentor Workload Changes
When a mentor's mentee load changes:
1. Department Admin updates assignment
2. Old data remains accessible (read-only)
3. New access levels take effect immediately
4. Audit trail updated

### Scenario 3: Student Role Change
If a student becomes a mentor or admin:
1. New role permissions take effect
2. Previous role access revoked
3. Historical mentee records accessible (read-only)
4. Session terminated and re-login required

### Scenario 4: Emergency Access
System Admin can temporarily elevate permissions:
1. Document reason in system
2. Set automatic expiration (24 hours default)
3. User notified of temporary access
4. Auto-revert to original role
5. Full audit trail maintained

---

## Permission Assignment Workflow

### Creating New User

1. **Department Admin/Institutional Admin** selects "Create User"
2. Enters user details (name, email, department)
3. Selects role (Mentor or Student for Department Admin)
4. For Mentor: Assign department and initial mentee capacity
5. For Student: Assign to mentor (or queue for assignment)
6. System generates temporary password
7. User receives credentials via email
8. On first login, user must change password
9. Role permissions automatically apply

### Assigning Mentor to Student

1. **Department Admin** selects "Assign Mentor"
2. Searches for student and available mentor
3. Reviews mentor's current workload
4. Confirms assignment
5. Both mentor and student notified
6. Access permissions updated immediately

### Permission Escalation

- Users cannot self-request permission escalation
- Escalation requires Department Admin (or higher) approval
- All escalation requests documented
- Changes logged with timestamp and approver

---

## Testing Permission Scenarios

| Test Case | Role | Expected Result |
|-----------|------|-----------------|
| TC-P001 | Super Admin accesses all features | Success |
| TC-P002 | Institutional Admin cannot access system settings | Denied |
| TC-P003 | Department Admin views only own department | Success |
| TC-P004 | Mentor views only assigned mentees | Success |
| TC-P005 | Student cannot delete other students | Denied |
| TC-P006 | Student views only own feedback | Success |
| TC-P007 | Mentor cannot modify student academic records | Denied |

---

## Conclusion

This comprehensive role and permission structure ensures:
- ✅ Least privilege access principle
- ✅ Clear separation of duties
- ✅ Department-level data isolation
- ✅ Security and compliance
- ✅ Operational efficiency
- ✅ Institutional accountability
- ✅ Scalability for growing institutions

All roles and permissions will be implemented consistently across the application and regularly audited for compliance.

---

**Document Version**: 1.0  
**Created**: January 19, 2026  
**Course**: 2301CS511 - Advanced Web Technology  
**Project**: Student Mentoring Management System (SMMS)  
**Status**: Approved for Implementation
