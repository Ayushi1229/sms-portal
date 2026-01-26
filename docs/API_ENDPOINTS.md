# API Endpoints Documentation - SMMS

## Overview

This document details all REST API endpoints for the Student Mentoring Management System. All endpoints use JSON for request/response bodies and require authentication except where noted.

**Base URL**: `/api`

---

## Authentication & Authorization

### Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not authenticated) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 500 | Internal Server Error |

---

## 1. Authentication Endpoints

### POST /api/auth/register
**Description**: Create a new user account (admin-only)  
**Access**: super_admin, institutional_admin, department_admin  
**Rate Limit**: 10 requests/hour

**Request Body**:
```json
{
  "email": "string (required, email format)",
  "roleId": "number (required, 1-5)",
  "departmentId": "string (optional, uuid)",
  "institutionId": "string (optional, uuid)",
  "profile": {
    "firstName": "string (required)",
    "lastName": "string (required)",
    "phone": "string (optional)"
  }
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "string",
    "status": "INVITED",
    "inviteToken": "string (one-time setup token)"
  }
}
```

---

### POST /api/auth/login
**Description**: Authenticate user and receive JWT tokens  
**Access**: Public  
**Rate Limit**: 5 requests/15min per IP

**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "role": "string",
      "profile": {
        "firstName": "string",
        "lastName": "string"
      }
    },
    "accessToken": "string (JWT, 15min expiry)",
    "refreshToken": "string (JWT, 7 days expiry)"
  }
}
```

**Note**: Sets HTTP-only cookie with refresh token

---

### POST /api/auth/logout
**Description**: Invalidate current session  
**Access**: Authenticated users  
**Request Body**: None

**Response (200)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST /api/auth/refresh
**Description**: Get new access token using refresh token  
**Access**: Valid refresh token in cookie  
**Request Body**: None

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "string"
  }
}
```

---

### POST /api/auth/password/reset/request
**Description**: Request password reset email  
**Access**: Public  
**Rate Limit**: 3 requests/hour per email

**Request Body**:
```json
{
  "email": "string (required)"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

---

### POST /api/auth/password/reset/confirm
**Description**: Reset password with token  
**Access**: Public (requires valid token)

**Request Body**:
```json
{
  "token": "string (required)",
  "newPassword": "string (required, min 8 chars)"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## 2. User Management Endpoints

### GET /api/users
**Description**: List users with filters and pagination  
**Access**: super_admin, institutional_admin, department_admin  
**Scope**: Department-based isolation for department_admin

**Query Parameters**:
```
?departmentId=uuid (optional)
&roleId=number (optional)
&status=ACTIVE|DISABLED|INVITED (optional)
&search=string (optional, searches name/email)
&page=number (default: 1)
&limit=number (default: 20, max: 100)
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "string",
        "role": { "id": 1, "name": "mentor" },
        "department": { "id": "uuid", "name": "CSE" },
        "status": "ACTIVE",
        "profile": {
          "firstName": "string",
          "lastName": "string",
          "phone": "string"
        },
        "createdAt": "ISO 8601 date"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

---

### POST /api/users
**Description**: Create new user  
**Access**: super_admin, institutional_admin, department_admin  
**Same as**: `/api/auth/register`

---

### GET /api/users/:id
**Description**: Get user details  
**Access**: All authenticated users (own profile), admins (any user in scope)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "string",
    "role": { "id": 4, "name": "mentor" },
    "department": { "id": "uuid", "name": "CSE", "code": "CSE" },
    "institution": { "id": "uuid", "name": "Sample Institute" },
    "status": "ACTIVE",
    "lastLoginAt": "ISO 8601 date",
    "profile": {
      "firstName": "string",
      "lastName": "string",
      "phone": "string",
      "avatarUrl": "string",
      "title": "string",
      "bio": "string"
    },
    "mentorProfile": {
      "designation": "Associate Professor",
      "specialization": "Software Engineering",
      "maxMentees": 15,
      "availabilityStatus": "AVAILABLE"
    },
    "createdAt": "ISO 8601 date"
  }
}
```

---

### PATCH /api/users/:id
**Description**: Update user profile and settings  
**Access**: Own profile (limited fields), admins (full access in scope)

**Request Body**:
```json
{
  "profile": {
    "firstName": "string (optional)",
    "lastName": "string (optional)",
    "phone": "string (optional)",
    "bio": "string (optional)"
  },
  "status": "ACTIVE|DISABLED (admin only)",
  "departmentId": "uuid (admin only)"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "string",
    "profile": { "firstName": "Updated Name" }
  }
}
```

---

### DELETE /api/users/:id
**Description**: Soft-delete user (set status to DISABLED)  
**Access**: super_admin, institutional_admin

**Response (200)**:
```json
{
  "success": true,
  "message": "User disabled successfully"
}
```

---

## 3. Department & Institution Endpoints

### GET /api/institutions
**Description**: List institutions  
**Access**: super_admin, institutional_admin

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Sample Institute",
      "code": "INST001",
      "contactEmail": "admin@sample.edu"
    }
  ]
}
```

---

### GET /api/departments
**Description**: List departments  
**Access**: All authenticated users  
**Scope**: Filtered by institution for institutional_admin

**Query Parameters**:
```
?institutionId=uuid (optional)
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Computer Science & Engineering",
      "code": "CSE",
      "institution": {
        "id": "uuid",
        "name": "Sample Institute"
      }
    }
  ]
}
```

---

## 4. Mentor-Mentee Management

### GET /api/mentors
**Description**: List mentors with assignment statistics  
**Access**: department_admin, institutional_admin, super_admin

**Query Parameters**:
```
?departmentId=uuid (optional)
&availabilityStatus=AVAILABLE|LIMITED|UNAVAILABLE (optional)
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "profile": {
        "firstName": "Dr. Sarah",
        "lastName": "Johnson"
      },
      "mentorProfile": {
        "designation": "Associate Professor",
        "specialization": "Software Engineering",
        "maxMentees": 15,
        "availabilityStatus": "AVAILABLE"
      },
      "stats": {
        "activeAssignments": 8,
        "totalSessions": 42,
        "averageRating": 4.5
      }
    }
  ]
}
```

---

### GET /api/mentees
**Description**: List students with risk and summary  
**Access**: mentor (own mentees), department_admin, institutional_admin

**Query Parameters**:
```
?departmentId=uuid (optional)
&riskLevel=LOW|MEDIUM|HIGH (optional)
&mentorId=uuid (optional)
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "profile": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "studentProfile": {
        "rollNumber": "CSE2023001",
        "program": "B.Tech CS",
        "yearOfStudy": 2,
        "gpa": 8.5,
        "attendancePct": 92.5,
        "riskLevel": "LOW"
      },
      "currentMentor": {
        "id": "uuid",
        "name": "Dr. Sarah Johnson"
      },
      "stats": {
        "totalSessions": 5,
        "lastSessionDate": "2026-01-20",
        "activeGoals": 2
      }
    }
  ]
}
```

---

### POST /api/assignments
**Description**: Assign mentor to student  
**Access**: department_admin

**Request Body**:
```json
{
  "mentorId": "uuid (required)",
  "studentId": "uuid (required)",
  "departmentId": "uuid (required)",
  "notes": "string (optional)"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "mentor": { "id": "uuid", "name": "Dr. Sarah Johnson" },
    "student": { "id": "uuid", "name": "John Doe" },
    "status": "ACTIVE",
    "assignedAt": "ISO 8601 date"
  }
}
```

---

### GET /api/assignments
**Description**: List mentor-student assignments  
**Access**: mentor (own), student (own), admins (all in scope)

**Query Parameters**:
```
?mentorId=uuid (optional)
&studentId=uuid (optional)
&status=ACTIVE|PAUSED|ENDED (optional)
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "mentor": { "id": "uuid", "name": "Dr. Sarah Johnson" },
      "student": { "id": "uuid", "name": "John Doe", "rollNumber": "CSE2023001" },
      "status": "ACTIVE",
      "assignedAt": "ISO 8601 date",
      "stats": {
        "totalSessions": 5,
        "lastSessionDate": "2026-01-20"
      }
    }
  ]
}
```

---

### PATCH /api/assignments/:id
**Description**: Update assignment status  
**Access**: department_admin

**Request Body**:
```json
{
  "status": "ACTIVE|PAUSED|ENDED (optional)",
  "notes": "string (optional)",
  "endedAt": "ISO 8601 date (optional, required if status=ENDED)"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "ENDED",
    "endedAt": "ISO 8601 date"
  }
}
```

---

## 5. Session Management

### POST /api/sessions
**Description**: Create mentoring session record  
**Access**: mentor

**Request Body**:
```json
{
  "assignmentId": "uuid (required)",
  "sessionDate": "ISO 8601 date (required)",
  "mode": "IN_PERSON|ONLINE|PHONE (required)",
  "location": "string (optional)",
  "topic": "string (required, max 500 chars)",
  "summary": "string (optional)",
  "actionItems": ["string array (optional)"],
  "nextMeetingOn": "ISO 8601 date (optional)",
  "attendance": "PRESENT|ABSENT (default: PRESENT)",
  "status": "SCHEDULED|COMPLETED (default: SCHEDULED)"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "assignmentId": "uuid",
    "sessionDate": "ISO 8601 date",
    "topic": "Academic Performance Review",
    "status": "COMPLETED",
    "createdAt": "ISO 8601 date"
  }
}
```

---

### GET /api/sessions
**Description**: List sessions with filters  
**Access**: mentor (own), student (own), admins (all in scope)

**Query Parameters**:
```
?assignmentId=uuid (optional)
&mentorId=uuid (optional)
&studentId=uuid (optional)
&status=SCHEDULED|COMPLETED|CANCELLED (optional)
&dateFrom=YYYY-MM-DD (optional)
&dateTo=YYYY-MM-DD (optional)
&page=number
&limit=number
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "uuid",
        "sessionDate": "ISO 8601 date",
        "mode": "IN_PERSON",
        "topic": "Academic Review",
        "status": "COMPLETED",
        "mentor": { "id": "uuid", "name": "Dr. Sarah Johnson" },
        "student": { "id": "uuid", "name": "John Doe" },
        "feedbackCount": 2
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 45 }
  }
}
```

---

### GET /api/sessions/:id
**Description**: Get session details  
**Access**: mentor (own), student (own), admins

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "assignment": {
      "id": "uuid",
      "mentor": { "id": "uuid", "name": "Dr. Sarah Johnson" },
      "student": { "id": "uuid", "name": "John Doe" }
    },
    "sessionDate": "ISO 8601 date",
    "mode": "IN_PERSON",
    "location": "Faculty Office 301",
    "topic": "Academic Performance Review",
    "summary": "Discussed semester performance...",
    "actionItems": ["Complete pending assignments", "Attend tutorials"],
    "nextMeetingOn": "ISO 8601 date",
    "attendance": "PRESENT",
    "status": "COMPLETED",
    "feedback": [
      {
        "id": "uuid",
        "type": "MENTOR_TO_STUDENT",
        "rating": 4,
        "comments": "Good progress"
      }
    ],
    "attachments": [
      {
        "id": "uuid",
        "fileName": "notes.pdf",
        "sizeBytes": 124800
      }
    ]
  }
}
```

---

### PATCH /api/sessions/:id
**Description**: Update session details  
**Access**: mentor (own sessions)

**Request Body**:
```json
{
  "summary": "string (optional)",
  "actionItems": ["string array (optional)"],
  "nextMeetingOn": "ISO 8601 date (optional)",
  "status": "COMPLETED|CANCELLED (optional)"
}
```

---

### POST /api/sessions/:id/cancel
**Description**: Cancel scheduled session  
**Access**: mentor, student (own)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CANCELLED"
  }
}
```

---

## 6. Feedback Management

### POST /api/sessions/:sessionId/feedback
**Description**: Add feedback to session  
**Access**: mentor, student (participants only)

**Request Body**:
```json
{
  "type": "MENTOR_TO_STUDENT|STUDENT_TO_MENTOR (required)",
  "rating": "number 1-5 (required)",
  "comments": "string (optional)",
  "visibility": "MENTOR|STUDENT|DEPARTMENT_ADMIN (default: MENTOR)"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "sessionId": "uuid",
    "type": "MENTOR_TO_STUDENT",
    "rating": 4,
    "comments": "Good progress shown"
  }
}
```

---

### GET /api/feedback
**Description**: Get feedback with filters  
**Access**: mentor, student, admins

**Query Parameters**:
```
?recipientUserId=uuid (optional)
&type=MENTOR_TO_STUDENT|STUDENT_TO_MENTOR (optional)
&sessionId=uuid (optional)
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "session": {
        "id": "uuid",
        "topic": "Academic Review",
        "sessionDate": "ISO 8601 date"
      },
      "giver": { "id": "uuid", "name": "Dr. Sarah Johnson" },
      "recipient": { "id": "uuid", "name": "John Doe" },
      "type": "MENTOR_TO_STUDENT",
      "rating": 4,
      "comments": "Showing improvement",
      "createdAt": "ISO 8601 date"
    }
  ]
}
```

---

## 7. Goals & Progress

### POST /api/students/:studentId/goals
**Description**: Create goal for student  
**Access**: mentor (for own mentees), student (for self)

**Request Body**:
```json
{
  "title": "string (required, max 255 chars)",
  "category": "ACADEMIC|BEHAVIORAL|CAREER|WELLNESS (required)",
  "description": "string (optional)",
  "targetDate": "ISO 8601 date (optional)",
  "progressPct": "number 0-100 (default: 0)"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "studentId": "uuid",
    "title": "Improve Data Structures Grade",
    "category": "ACADEMIC",
    "status": "NOT_STARTED",
    "progressPct": 0,
    "targetDate": "2026-05-31"
  }
}
```

---

### GET /api/students/:studentId/goals
**Description**: List student goals  
**Access**: mentor (own mentees), student (self), admins

**Query Parameters**:
```
?status=NOT_STARTED|IN_PROGRESS|AT_RISK|COMPLETED (optional)
&category=ACADEMIC|BEHAVIORAL|CAREER|WELLNESS (optional)
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Improve DS Grade",
      "category": "ACADEMIC",
      "status": "IN_PROGRESS",
      "progressPct": 35,
      "targetDate": "2026-05-31",
      "createdBy": { "id": "uuid", "name": "Dr. Sarah Johnson" },
      "latestUpdate": {
        "note": "Completed 3/5 assignments",
        "updatedAt": "ISO 8601 date"
      }
    }
  ]
}
```

---

### PATCH /api/goals/:id
**Description**: Update goal status/progress  
**Access**: mentor, student (own goals)

**Request Body**:
```json
{
  "status": "IN_PROGRESS|AT_RISK|COMPLETED (optional)",
  "progressPct": "number 0-100 (optional)",
  "targetDate": "ISO 8601 date (optional)"
}
```

---

### POST /api/goals/:goalId/updates
**Description**: Add progress note to goal  
**Access**: mentor, student

**Request Body**:
```json
{
  "note": "string (required)",
  "progressPct": "number 0-100 (required)",
  "status": "NOT_STARTED|IN_PROGRESS|AT_RISK|COMPLETED (required)"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "goalId": "uuid",
    "note": "Completed assignment 4, showing improvement",
    "progressPct": 60,
    "status": "IN_PROGRESS",
    "notedBy": { "id": "uuid", "name": "Dr. Sarah Johnson" }
  }
}
```

---

## 8. Alerts & Notifications

### GET /api/alerts
**Description**: Get student alerts  
**Access**: mentor (own mentees), student (self), admins

**Query Parameters**:
```
?studentId=uuid (optional)
&status=OPEN|CLOSED (optional)
&severity=INFO|WARN|CRITICAL (optional)
&category=ATTENDANCE|GPA|BEHAVIOR|GRIEVANCE (optional)
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "student": { "id": "uuid", "name": "Jane Smith", "rollNumber": "CSE2023002" },
      "severity": "WARN",
      "category": "ATTENDANCE",
      "message": "Attendance dropped to 78.5%",
      "status": "OPEN",
      "createdAt": "ISO 8601 date"
    }
  ]
}
```

---

### POST /api/alerts
**Description**: Create new alert  
**Access**: mentor, department_admin

**Request Body**:
```json
{
  "studentId": "uuid (required)",
  "severity": "INFO|WARN|CRITICAL (required)",
  "category": "ATTENDANCE|GPA|BEHAVIOR|GRIEVANCE (required)",
  "message": "string (required)"
}
```

---

### PATCH /api/alerts/:id/close
**Description**: Close an alert  
**Access**: mentor (own mentees), department_admin

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CLOSED",
    "closedAt": "ISO 8601 date"
  }
}
```

---

### GET /api/notifications
**Description**: Get user notifications  
**Access**: Authenticated user (own notifications)

**Query Parameters**:
```
?unreadOnly=boolean (default: false)
&type=SESSION_REMINDER|GOAL_DUE|ALERT|ASSIGNMENT|FEEDBACK (optional)
&limit=number (default: 50)
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "SESSION_REMINDER",
      "title": "Upcoming Mentoring Session",
      "body": "Session scheduled with John Doe on Jan 30",
      "readAt": null,
      "createdAt": "ISO 8601 date"
    }
  ]
}
```

---

### PATCH /api/notifications/:id/read
**Description**: Mark notification as read  
**Access**: Authenticated user (own notification)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "readAt": "ISO 8601 date"
  }
}
```

---

## 9. File Uploads

### POST /api/uploads/presign
**Description**: Get presigned URL for S3 upload  
**Access**: Authenticated users

**Request Body**:
```json
{
  "fileName": "string (required)",
  "mimeType": "string (required)",
  "sizeBytes": "number (required)"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "uploadUrl": "string (presigned S3 URL)",
    "uploadId": "uuid (reference for attach step)",
    "expiresIn": 3600
  }
}
```

---

### POST /api/uploads/attach
**Description**: Attach uploaded file to entity  
**Access**: Authenticated users

**Request Body**:
```json
{
  "uploadId": "uuid (from presign)",
  "relatedType": "SESSION|FEEDBACK|GOAL|ASSIGNMENT (required)",
  "relatedId": "uuid (required)"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fileName": "document.pdf",
    "mimeType": "application/pdf",
    "sizeBytes": 124800
  }
}
```

---

## 10. Reports & Analytics

### GET /api/reports/mentor-load
**Description**: Mentor workload report  
**Access**: department_admin, institutional_admin

**Query Parameters**:
```
?departmentId=uuid (optional)
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "mentor": { "id": "uuid", "name": "Dr. Sarah Johnson" },
      "activeAssignments": 8,
      "maxMentees": 15,
      "utilizationPct": 53.3,
      "totalSessions": 42,
      "averageSessionsPerMentee": 5.25
    }
  ]
}
```

---

### GET /api/reports/session-summary
**Description**: Session statistics report  
**Access**: department_admin, mentor

**Query Parameters**:
```
?mentorId=uuid (optional)
&departmentId=uuid (optional)
&dateFrom=YYYY-MM-DD
&dateTo=YYYY-MM-DD
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "totalSessions": 145,
    "completed": 120,
    "scheduled": 15,
    "cancelled": 10,
    "completionRate": 82.8,
    "averageRating": 4.3,
    "byMode": {
      "IN_PERSON": 85,
      "ONLINE": 50,
      "PHONE": 10
    }
  }
}
```

---

### GET /api/reports/risk
**Description**: At-risk students report  
**Access**: mentor, department_admin, institutional_admin

**Query Parameters**:
```
?departmentId=uuid (optional)
&riskLevel=MEDIUM|HIGH (default: MEDIUM,HIGH)
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "student": {
        "id": "uuid",
        "name": "Jane Smith",
        "rollNumber": "CSE2023002"
      },
      "riskLevel": "MEDIUM",
      "riskFactors": [
        { "type": "ATTENDANCE", "value": 78.5, "threshold": 85 },
        { "type": "GPA", "value": 7.2, "threshold": 7.5 }
      ],
      "mentor": { "id": "uuid", "name": "Dr. Sarah Johnson" },
      "lastSessionDate": "2026-01-15",
      "openAlerts": 2
    }
  ]
}
```

---

## 11. Audit Logs

### GET /api/audit
**Description**: View audit logs  
**Access**: super_admin, institutional_admin

**Query Parameters**:
```
?userId=uuid (optional)
&entity=string (optional, e.g., "users", "sessions")
&entityId=uuid (optional)
&action=string (optional, e.g., "create", "update", "delete")
&dateFrom=YYYY-MM-DD (optional)
&dateTo=YYYY-MM-DD (optional)
&page=number
&limit=number
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "number",
        "user": { "id": "uuid", "email": "admin@sample.edu" },
        "action": "create",
        "entity": "sessions",
        "entityId": "uuid",
        "ip": "192.168.1.100",
        "createdAt": "ISO 8601 date"
      }
    ],
    "pagination": { "page": 1, "limit": 50, "total": 1523 }
  }
}
```

---

## Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

**Common Error Codes**:
- `VALIDATION_ERROR` - Request validation failed
- `UNAUTHORIZED` - Not authenticated
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

---

## Rate Limits

| Endpoint Category | Limit |
|-------------------|-------|
| Authentication | 5 requests/15min per IP |
| Password Reset | 3 requests/hour per email |
| File Upload | 20 requests/hour per user |
| General API | 100 requests/15min per user |
| Reports | 30 requests/hour per user |

---

**Last Updated**: January 25, 2026  
**API Version**: 1.0.0
