/**
 * Script to create demo users for testing authentication
 * Run with: node scripts/create-demo-users.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Creating demo users for authentication testing...\n');

  // Get the first institution and department
  const institution = await prisma.institution.findFirst();
  const department = await prisma.department.findFirst();

  if (!institution || !department) {
    console.error('❌ Institution or Department not found. Please run seed first.');
    process.exit(1);
  }

  // Demo users with simple credentials
  const demoUsers = [
    {
      email: 'admin@example.com',
      password: 'admin123',
      roleId: 1, // super_admin
      firstName: 'Super',
      lastName: 'Admin',
      title: 'System Administrator',
    },
    {
      email: 'inst.admin@example.com',
      password: 'admin123',
      roleId: 2, // institutional_admin
      firstName: 'Institution',
      lastName: 'Admin',
      title: 'Institution Administrator',
    },
    {
      email: 'dept.admin@example.com',
      password: 'admin123',
      roleId: 3, // department_admin
      firstName: 'Department',
      lastName: 'Admin',
      title: 'Department Head',
      departmentId: department.id,
    },
    {
      email: 'mentor@example.com',
      password: 'mentor123',
      roleId: 4, // mentor
      firstName: 'Test',
      lastName: 'Mentor',
      title: 'Faculty Mentor',
      departmentId: department.id,
      isMentor: true,
    },
    {
      email: 'student@example.com',
      password: 'student123',
      roleId: 5, // student
      firstName: 'Test',
      lastName: 'Student',
      departmentId: department.id,
      isStudent: true,
    },
  ];

  for (const userData of demoUsers) {
    try {
      const passwordHash = await bcrypt.hash(userData.password, 10);

      // Create or update user
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          passwordHash,
          status: 'ACTIVE',
        },
        create: {
          email: userData.email,
          passwordHash,
          roleId: userData.roleId,
          status: 'ACTIVE',
          institutionId: institution.id,
          departmentId: userData.departmentId || null,
        },
      });

      // Create or update user profile
      await prisma.userProfile.upsert({
        where: { userId: user.id },
        update: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          title: userData.title,
        },
        create: {
          userId: user.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          title: userData.title || null,
        },
      });

      // Create mentor profile if needed
      if (userData.isMentor) {
        await prisma.mentorProfile.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            designation: userData.title,
            specialization: 'General Mentoring',
            capacityDefault: 10,
            maxMentees: 15,
            availabilityStatus: 'AVAILABLE',
          },
        });
      }

      // Create student profile if needed
      if (userData.isStudent) {
        await prisma.studentProfile.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            rollNumber: 'DEMO001',
            program: 'B.Tech Computer Science',
            yearOfStudy: 2,
            gpa: 8.0,
            attendancePct: 85.0,
            riskLevel: 'LOW',
          },
        });
      }

      console.log(`✅ Created user: ${userData.email} (${userData.firstName} ${userData.lastName})`);
    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error.message);
    }
  }

  console.log('\n✨ Demo users created successfully!\n');
  console.log('📋 Login Credentials:\n');
  console.log('Super Admin:');
  console.log('  Email: admin@example.com');
  console.log('  Password: admin123');
  console.log('  Dashboard: /dashboard/admin\n');
  
  console.log('Institutional Admin:');
  console.log('  Email: inst.admin@example.com');
  console.log('  Password: admin123');
  console.log('  Dashboard: /dashboard/admin\n');
  
  console.log('Department Admin:');
  console.log('  Email: dept.admin@example.com');
  console.log('  Password: admin123');
  console.log('  Dashboard: /dashboard/department\n');
  
  console.log('Mentor:');
  console.log('  Email: mentor@example.com');
  console.log('  Password: mentor123');
  console.log('  Dashboard: /dashboard/mentor\n');
  
  console.log('Student:');
  console.log('  Email: student@example.com');
  console.log('  Password: student123');
  console.log('  Dashboard: /dashboard/student\n');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
