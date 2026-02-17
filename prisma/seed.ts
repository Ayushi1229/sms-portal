import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================================================
  // 1. SEED ROLES
  // ============================================================================
  console.log('📝 Seeding roles...');
  
  const roles = [
    { id: 1, name: 'super_admin', description: 'System Administrator with full access' },
    { id: 2, name: 'institutional_admin', description: 'Institutional-level administrator' },
    { id: 3, name: 'department_admin', description: 'Department-level administrator' },
    { id: 4, name: 'mentor', description: 'Faculty mentor' },
    { id: 5, name: 'student', description: 'Student mentee' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: role,
    });
  }
  console.log('✅ Roles seeded');

  // ============================================================================
  // 2. SEED INSTITUTION
  // ============================================================================
  console.log('🏛️  Seeding institution...');
  
  const institution = await prisma.institution.upsert({
    where: { code: 'INST001' },
    update: {},
    create: {
      name: 'Sample Institute of Technology',
      code: 'INST001',
      address: '123 University Road, Tech City, TC 12345',
      contactEmail: 'admin@sampleinstitute.edu',
    },
  });
  console.log('✅ Institution seeded:', institution.name);

  // ============================================================================
  // 3. SEED DEPARTMENTS
  // ============================================================================
  console.log('🏢 Seeding departments...');
  
  const departments = [
    { code: 'CSE', name: 'Computer Science & Engineering' },
    { code: 'ECE', name: 'Electronics & Communication Engineering' },
    { code: 'ME', name: 'Mechanical Engineering' },
  ];

  const createdDepartments = [];
  for (const dept of departments) {
    const department = await prisma.department.upsert({
      where: { institutionId_code: { institutionId: institution.id, code: dept.code } },
      update: {},
      create: {
        institutionId: institution.id,
        code: dept.code,
        name: dept.name,
      },
    });
    createdDepartments.push(department);
  }
  console.log('✅ Departments seeded:', createdDepartments.length);

  const cseDept = createdDepartments.find(d => d.code === 'CSE')!;

  // ============================================================================
  // 4. SEED USERS
  // ============================================================================
  console.log('👥 Seeding users...');
  
  // Hash passwords (using 4 rounds for instant login performance)
  const defaultPassword = await bcrypt.hash('Password@123', 4);

  // Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@sampleinstitute.edu' },
    update: {},
    create: {
      email: 'admin@sampleinstitute.edu',
      passwordHash: defaultPassword,
      roleId: 1, // super_admin
      status: 'ACTIVE',
      institutionId: institution.id,
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: superAdmin.id },
    update: {},
    create: {
      userId: superAdmin.id,
      firstName: 'System',
      lastName: 'Administrator',
      phone: '+1234567890',
      title: 'System Admin',
    },
  });

  // Department Admin (CSE)
  const deptAdmin = await prisma.user.upsert({
    where: { email: 'cse.admin@sampleinstitute.edu' },
    update: {},
    create: {
      email: 'cse.admin@sampleinstitute.edu',
      passwordHash: defaultPassword,
      roleId: 3, // department_admin
      status: 'ACTIVE',
      institutionId: institution.id,
      departmentId: cseDept.id,
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: deptAdmin.id },
    update: {},
    create: {
      userId: deptAdmin.id,
      firstName: 'CSE',
      lastName: 'Admin',
      phone: '+1234567891',
      title: 'Department Head',
    },
  });

  // Sample Mentor
  const mentor = await prisma.user.upsert({
    where: { email: 'mentor@sampleinstitute.edu' },
    update: {},
    create: {
      email: 'mentor@sampleinstitute.edu',
      passwordHash: defaultPassword,
      roleId: 4, // mentor
      status: 'ACTIVE',
      institutionId: institution.id,
      departmentId: cseDept.id,
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: mentor.id },
    update: {},
    create: {
      userId: mentor.id,
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      phone: '+1234567892',
      title: 'Associate Professor',
      bio: 'Passionate educator with 10+ years of experience in mentoring students.',
    },
  });

  await prisma.mentorProfile.upsert({
    where: { userId: mentor.id },
    update: {},
    create: {
      userId: mentor.id,
      designation: 'Associate Professor',
      specialization: 'Software Engineering, Data Structures',
      capacityDefault: 10,
      maxMentees: 15,
      availabilityStatus: 'AVAILABLE',
    },
  });

  // Sample Student 1
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@sampleinstitute.edu' },
    update: {},
    create: {
      email: 'student1@sampleinstitute.edu',
      passwordHash: defaultPassword,
      roleId: 5, // student
      status: 'ACTIVE',
      institutionId: institution.id,
      departmentId: cseDept.id,
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: student1.id },
    update: {},
    create: {
      userId: student1.id,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567893',
    },
  });

  await prisma.studentProfile.upsert({
    where: { userId: student1.id },
    update: {},
    create: {
      userId: student1.id,
      rollNumber: 'CSE2023001',
      program: 'B.Tech Computer Science',
      yearOfStudy: 2,
      gpa: 8.5,
      attendancePct: 92.5,
      riskLevel: 'LOW',
    },
  });

  // Sample Student 2
  const student2 = await prisma.user.upsert({
    where: { email: 'student2@sampleinstitute.edu' },
    update: {},
    create: {
      email: 'student2@sampleinstitute.edu',
      passwordHash: defaultPassword,
      roleId: 5, // student
      status: 'ACTIVE',
      institutionId: institution.id,
      departmentId: cseDept.id,
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: student2.id },
    update: {},
    create: {
      userId: student2.id,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1234567894',
    },
  });

  await prisma.studentProfile.upsert({
    where: { userId: student2.id },
    update: {},
    create: {
      userId: student2.id,
      rollNumber: 'CSE2023002',
      program: 'B.Tech Computer Science',
      yearOfStudy: 2,
      gpa: 7.2,
      attendancePct: 78.5,
      riskLevel: 'MEDIUM',
    },
  });

  console.log('✅ Users seeded');

  // ============================================================================
  // 5. SEED MENTOR ASSIGNMENTS
  // ============================================================================
  console.log('🔗 Seeding mentor assignments...');

  const assignment1 = await prisma.mentorAssignment.upsert({
    where: { id: 'assignment-1-seed' },
    update: {},
    create: {
      id: 'assignment-1-seed',
      mentorId: mentor.id,
      studentId: student1.id,
      departmentId: cseDept.id,
      assignedById: deptAdmin.id,
      status: 'ACTIVE',
      notes: 'Initial assignment for academic year 2025-26',
    },
  });

  const assignment2 = await prisma.mentorAssignment.upsert({
    where: { id: 'assignment-2-seed' },
    update: {},
    create: {
      id: 'assignment-2-seed',
      mentorId: mentor.id,
      studentId: student2.id,
      departmentId: cseDept.id,
      assignedById: deptAdmin.id,
      status: 'ACTIVE',
      notes: 'Initial assignment for academic year 2025-26',
    },
  });

  console.log('✅ Mentor assignments seeded');

  // ============================================================================
  // 6. SEED SAMPLE SESSION
  // ============================================================================
  console.log('📅 Seeding sample session...');

  const session = await prisma.sessionRecord.create({
    data: {
      assignmentId: assignment1.id,
      sessionDate: new Date('2026-01-20T10:00:00Z'),
      mode: 'IN_PERSON',
      location: 'Faculty Office, Room 301',
      topic: 'Academic Performance Review - Semester 3',
      summary: 'Discussed academic progress, challenges in Data Structures course, and career goals. Student shows strong interest in software development.',
      actionItems: {
        items: [
          'Complete pending DS assignments by Jan 25',
          'Attend extra tutorial sessions on algorithms',
          'Start preparing for upcoming placement season',
        ],
      },
      nextMeetingOn: new Date('2026-02-05T10:00:00Z'),
      attendance: 'PRESENT',
      status: 'COMPLETED',
      createdById: mentor.id,
    },
  });

  console.log('✅ Sample session seeded');

  // ============================================================================
  // 7. SEED SAMPLE GOAL
  // ============================================================================
  console.log('🎯 Seeding sample goal...');

  const goal = await prisma.goal.create({
    data: {
      studentId: student1.id,
      title: 'Improve Data Structures Grade to A',
      category: 'ACADEMIC',
      description: 'Focus on understanding advanced algorithms and practice coding problems daily.',
      targetDate: new Date('2026-05-31'),
      status: 'IN_PROGRESS',
      progressPct: 35,
      createdById: mentor.id,
    },
  });

  await prisma.goalUpdate.create({
    data: {
      goalId: goal.id,
      notedById: mentor.id,
      note: 'Student has completed 3 out of 5 assignments with good grades. Showing improvement.',
      progressPct: 35,
      status: 'IN_PROGRESS',
    },
  });

  console.log('✅ Sample goal seeded');

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log('\n🎉 Database seeding completed successfully!\n');
  console.log('📊 Seeded Data Summary:');
  console.log('  - Roles: 5');
  console.log('  - Institutions: 1');
  console.log('  - Departments: 3');
  console.log('  - Users: 5 (1 admin, 1 dept admin, 1 mentor, 2 students)');
  console.log('  - Mentor Assignments: 2');
  console.log('  - Sessions: 1');
  console.log('  - Goals: 1\n');
  console.log('🔐 Default Password for all users: Password@123\n');
  console.log('👤 Test Accounts:');
  console.log('  - Super Admin: admin@sampleinstitute.edu');
  console.log('  - Dept Admin:  cse.admin@sampleinstitute.edu');
  console.log('  - Mentor:      mentor@sampleinstitute.edu');
  console.log('  - Student 1:   student1@sampleinstitute.edu');
  console.log('  - Student 2:   student2@sampleinstitute.edu\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });


  