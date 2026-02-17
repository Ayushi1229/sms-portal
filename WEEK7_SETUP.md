# Week 7 Setup Instructions

## Database Setup Required

Before testing the authentication system, you need to set up the database:

### 1. Create .env File

Copy the example environment file:
```bash
cp .env.example .env
```

### 2. Configure Database Connection

Edit `.env` and update the DATABASE_URL with your MySQL credentials:

```env
# Example for local MySQL
DATABASE_URL="mysql://root:your_password@localhost:3306/smms_dev"

# JWT Secrets (generate random strings)
JWT_SECRET="your-super-secret-jwt-key-here-change-this"
JWT_REFRESH_SECRET="your-refresh-secret-key-here-change-this"

NODE_ENV="development"
```

### 3. Run Database Migrations

```bash
npx prisma migrate dev
```

### 4. Seed the Database

```bash
npx prisma db seed
```

### 5. Create Demo Users (Optional)

```bash
node scripts/create-demo-users.js
```

## Alternative: Use Existing Seeded Users

If you've already run the seed, you can use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@sampleinstitute.edu` | `Password@123` |
| Department Admin | `cse.admin@sampleinstitute.edu` | `Password@123` |
| Mentor | `mentor@sampleinstitute.edu` | `Password@123` |
| Student | `student1@sampleinstitute.edu` | `Password@123` |

## Testing the Application

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Access the Application

Open your browser and navigate to:
```
http://localhost:3000/login
```

### 3. Test Authentication Flow

1. **Login as Super Admin**
   - Email: `admin@sampleinstitute.edu`
   - Password: `Password@123`
   - Should redirect to: `/dashboard/admin`

2. **Test Role-Based Access**
   - Try accessing `/dashboard/mentor` as admin
   - Should show unauthorized message
   - Logout and login as mentor
   - Now you can access `/dashboard/mentor`

3. **Test Protected Routes**
   - Logout
   - Try accessing `/dashboard` directly
   - Should redirect to login page

## Verification Checklist

- [ ] Database connection works
- [ ] Migrations completed successfully
- [ ] Seed data created
- [ ] Can login with test credentials
- [ ] Redirected to correct dashboard based on role
- [ ] Cannot access unauthorized dashboards
- [ ] Logout works correctly
- [ ] Protected routes redirect to login

## Troubleshooting

### "Authentication failed against database server"
- Check MySQL is running
- Verify DATABASE_URL credentials in .env
- Ensure database exists

### "Cannot find module @prisma/client"
```bash
npm install
npx prisma generate
```

### "Migration failed"
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### "No users found"
```bash
npx prisma db seed
# or
node scripts/create-demo-users.js
```

## Environment Variables Template

Create a `.env` file with:

```env
DATABASE_URL="mysql://root:password@localhost:3306/smms_dev"
JWT_SECRET="change-this-to-a-random-secret-key"
JWT_REFRESH_SECRET="change-this-to-another-random-secret-key"
NODE_ENV="development"
```

## Quick Command Reference

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Create demo users
node scripts/create-demo-users.js

# Start development server
npm run dev

# View database in Prisma Studio
npx prisma studio
```
