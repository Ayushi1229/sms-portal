# Database Setup Guide - MySQL with Prisma

## Prerequisites

- **MySQL Server 8.0+** installed and running
- **MySQLWorkbench** (recommended for visual database management)
- **Node.js 20+** installed
- **npm/yarn** package manager

---

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- `@prisma/client` - Prisma database client
- `prisma` - Prisma CLI (dev dependency)
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `zod` - Schema validation

---

## Step 2: Create MySQL Database

### Option A: Using MySQLWorkbench GUI

1. Open MySQLWorkbench
2. Connect to your MySQL server
3. Create a new database:
   ```sql
   CREATE DATABASE smms_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
4. Create a dedicated user (optional but recommended):
   ```sql
   CREATE USER 'smms_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON smms_dev.* TO 'smms_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Option B: Using MySQL Command Line

```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE smms_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'smms_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON smms_dev.* TO 'smms_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# .env
DATABASE_URL="mysql://smms_user:your_secure_password@localhost:3306/smms_dev"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-token-secret-key"

# Application
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important:** 
- Replace `your_secure_password` with your actual MySQL password
- Replace JWT secrets with strong random strings in production
- Never commit `.env` to version control

### DATABASE_URL Format:
```
mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

Example with default MySQL root user:
```
DATABASE_URL="mysql://root:password123@localhost:3306/smms_dev"
```

---

## Step 4: Generate Prisma Client

```bash
npm run db:generate
```

This command runs `prisma generate` which:
- Reads your `prisma/schema.prisma` file
- Generates the Prisma Client based on your data models
- Creates TypeScript types for type-safe database access

---

## Step 5: Run Database Migrations

### Development (with migration history):
```bash
npm run db:migrate
```

This will:
- Create a new migration in `prisma/migrations/`
- Apply the migration to your database
- Update the Prisma Client

**First time?** You'll be prompted to name your migration. Use a descriptive name like:
```
init_schema
```

### Quick Push (without migration files):
```bash
npm run db:push
```

Use this for rapid prototyping. It syncs your schema directly to the database without creating migration files.

---

## Step 6: Seed the Database

```bash
npm run db:seed
```

This will populate your database with:
- **5 Roles** (super_admin, institutional_admin, department_admin, mentor, student)
- **1 Institution** (Sample Institute of Technology)
- **3 Departments** (CSE, ECE, ME)
- **5 Test Users**:
  - System Admin: `admin@sampleinstitute.edu`
  - Department Admin: `cse.admin@sampleinstitute.edu`
  - Mentor: `mentor@sampleinstitute.edu`
  - Student 1: `student1@sampleinstitute.edu`
  - Student 2: `student2@sampleinstitute.edu`
- **Default password for all:** `Password@123`
- **2 Mentor-Student Assignments**
- **1 Sample Session**
- **1 Sample Goal**

---

## Step 7: Verify Database Setup

### Using Prisma Studio (Visual Database Browser):
```bash
npm run db:studio
```

This opens Prisma Studio at `http://localhost:5555` where you can:
- Browse all tables
- View/edit records
- Test relationships

### Using MySQLWorkbench:
1. Open MySQLWorkbench
2. Connect to your server
3. Navigate to `smms_dev` database
4. Browse tables and verify data

### Using MySQL CLI:
```bash
mysql -u smms_user -p smms_dev
```

Then:
```sql
SHOW TABLES;
SELECT * FROM roles;
SELECT * FROM users;
```

---

## Common npm Scripts

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to DB (no migrations) |
| `npm run db:migrate` | Create and apply migration |
| `npm run db:migrate:deploy` | Apply migrations in production |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## Database Schema Overview

### Core Tables:
- **institutions** - Educational institutions
- **departments** - Departments within institutions
- **roles** - User role definitions (5 roles)
- **users** - All system users with authentication
- **user_profiles** - User personal information
- **mentor_profiles** - Mentor-specific data
- **student_profiles** - Student-specific data

### Mentoring Tables:
- **mentor_assignments** - Mentor-student pairings
- **session_records** - Mentoring session logs
- **session_feedback** - Feedback from sessions
- **goals** - Student goals and targets
- **goal_updates** - Progress tracking for goals

### System Tables:
- **notifications** - In-app notifications
- **alerts** - At-risk student alerts
- **attachments** - File metadata
- **audit_logs** - System audit trail
- **password_resets** - Password reset tokens

---

## Troubleshooting

### Error: "Can't connect to MySQL server"
- Verify MySQL is running: `sudo systemctl status mysql` (Linux) or check Services (Windows)
- Check connection details in `.env`
- Verify firewall settings

### Error: "Access denied for user"
- Verify username and password in `DATABASE_URL`
- Check user permissions: `SHOW GRANTS FOR 'smms_user'@'localhost';`

### Error: "Unknown database 'smms_dev'"
- Database doesn't exist. Create it using Step 2

### Error: "Prisma Client not generated"
- Run `npm run db:generate`

### Migrations out of sync
- Reset database (⚠️ deletes all data):
  ```bash
  npx prisma migrate reset
  ```

### Need to start fresh?
```bash
# Drop database in MySQL
mysql -u root -p -e "DROP DATABASE IF EXISTS smms_dev; CREATE DATABASE smms_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Reset Prisma migrations
rm -rf prisma/migrations

# Re-run migrations and seed
npm run db:migrate
npm run db:seed
```

---

## Production Deployment Checklist

- [ ] Use strong, randomly generated JWT secrets
- [ ] Use separate production database
- [ ] Enable SSL/TLS for database connections
- [ ] Set `NODE_ENV=production`
- [ ] Never expose `.env` file
- [ ] Run `prisma migrate deploy` (not `migrate dev`)
- [ ] Set up automated backups
- [ ] Configure connection pooling
- [ ] Enable query logging for monitoring
- [ ] Use environment-specific DATABASE_URL

---

## Migration to PostgreSQL (Future)

The schema is designed to be portable. To migrate:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/smms_dev"
   ```

3. Generate new migration:
   ```bash
   npm run db:migrate
   ```

4. Export/import data using `pg_dump` or Prisma seed scripts

---

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Prisma MySQL Guide](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [MySQLWorkbench Manual](https://dev.mysql.com/doc/workbench/en/)

---

## Support

For issues or questions:
1. Check Prisma logs: Look for detailed error messages
2. Verify MySQL server status and logs
3. Review `.env` configuration
4. Check GitHub Issues for known problems

---

**Last Updated**: January 25, 2026  
**Schema Version**: 1.0.0  
**Database**: MySQL 8.0+
