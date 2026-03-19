# Student Mentoring Management System (SMMS)

SMMS is a full-stack mentoring platform built for the Advanced Web Technology course.

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Prisma ORM + MySQL
- JWT Authentication + Role-Based Access Control

## Local Setup

1. Install dependencies

npm install

2. Configure environment variables in .env.local

- DATABASE_URL
- JWT_SECRET
- JWT_REFRESH_SECRET

3. Database setup

npm run db:generate
npm run db:push
npm run db:seed

4. Run development server

npm run dev

## Quality Gates

- Lint

npm run lint

- Tests

npm run test

- Production build

npm run build

## Deployment

Primary deployment target is Vercel.

See full deployment instructions here:

- docs/DEPLOYMENT_GUIDE.md

## Key Features Completed

- Role-based dashboards and navigation
- Secure API authorization and scoped data access
- Core mentoring flows (assignments, sessions, goals, feedback)
- Server-side search, filtering, and pagination
- File management (upload, list, delete)
- Centralized API error handling and request validation
- Automated unit and API tests
