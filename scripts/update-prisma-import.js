const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  // Auth routes
  'app/api/auth/login/route.ts',
  'app/api/auth/register/route.ts',
  'app/api/auth/refresh/route.ts',
  'app/api/auth/logout/route.ts',
  'app/api/auth/me/route.ts',
  // Students routes
  'app/api/students/route.ts',
  'app/api/students/[id]/route.ts',
  // Mentors routes
  'app/api/mentors/route.ts',
  'app/api/mentors/[id]/route.ts',
  // Sessions routes
  'app/api/sessions/route.ts',
  'app/api/sessions/[id]/route.ts',
  // Goals routes
  'app/api/goals/route.ts',
  'app/api/goals/[id]/route.ts',
  // Dashboard
  'app/api/dashboard/route.ts',
];

function updateFile(filePath) {
  const fullPath = path.join(__dirname, '../', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');

  // Replace old Prisma imports
  content = content.replace(
    /const prisma = new PrismaClient\(\);\n/g,
    ''
  );

  // Add new import if not already present
  if (!content.includes("import { prisma } from '@/lib/prisma';")) {
    // Find the last import statement
    const lastImportMatch = content.match(/^import .* from ['"][^'"]*['"];/gm);
    if (lastImportMatch) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1];
      content = content.replace(
        lastImport,
        lastImport + "\nimport { prisma } from '@/lib/prisma';"
      );
    }
  }

  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`✅ Updated: ${filePath}`);
}

console.log('🚀 Starting Prisma imports update...\n');

filesToUpdate.forEach(updateFile);

console.log('\n✅ All files updated successfully!');