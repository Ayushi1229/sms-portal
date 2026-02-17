
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const assignments = await prisma.mentorAssignment.findMany({
    include: {
      mentor: { include: { profile: true } },
      student: { include: { profile: true } },
      department: true,
    }
  });
  console.log('Assignments count:', assignments.length);
  console.log('Assignments:', JSON.stringify(assignments, null, 2));

  const users = await prisma.user.findMany({
    include: {
        role: true,
        profile: true
    }
  });
  console.log('Users count:', users.length);
  // console.log('Users:', JSON.stringify(users, null, 2));

  const roles = await prisma.role.findMany();
  console.log('Roles:', roles);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
