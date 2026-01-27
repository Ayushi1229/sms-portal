const fs = require('fs');
const path = require('path');

console.log('\n🔍 VERIFYING WEEK 6 SETUP...\n');
console.log('='.repeat(70));

const checks = {
  'Core Files': [
    'lib/prisma.ts',
    'lib/api/response.ts',
    'lib/middleware/auth.ts',
  ],
  'Auth Routes': [
    'app/api/auth/login/route.ts',
    'app/api/auth/register/route.ts',
    'app/api/auth/refresh/route.ts',
    'app/api/auth/logout/route.ts',
    'app/api/auth/me/route.ts',
  ],
  'Students Routes': [
    'app/api/students/route.ts',
    'app/api/students/[id]/route.ts',
  ],
  'Mentors Routes': [
    'app/api/mentors/route.ts',
    'app/api/mentors/[id]/route.ts',
  ],
  'Sessions Routes': [
    'app/api/sessions/route.ts',
    'app/api/sessions/[id]/route.ts',
  ],
  'Goals Routes': [
    'app/api/goals/route.ts',
    'app/api/goals/[id]/route.ts',
  ],
  'Dashboard Routes': [
    'app/api/dashboard/route.ts',
  ],
  'Validation Schemas': [
    'lib/validations/auth.ts',
  ],
  'Environment': [
    '.env',
  ],
};

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

Object.entries(checks).forEach(([category, files]) => {
  console.log(`\n📂 ${category}:`);
  console.log('-'.repeat(70));
  
  files.forEach(file => {
    totalChecks++;
    const fullPath = path.join(__dirname, '../', file);
    const exists = fs.existsSync(fullPath);
    
    if (exists) {
      console.log(`  ✅ ${file}`);
      passedChecks++;
    } else {
      console.log(`  ❌ ${file} - MISSING`);
      failedChecks++;
    }
  });
});

console.log('\n' + '='.repeat(70));

console.log('\n🔗 CHECKING PRISMA IMPORTS IN ROUTES:\n');

const routeFiles = [
  'app/api/auth/login/route.ts',
  'app/api/students/route.ts',
  'app/api/mentors/route.ts',
  'app/api/sessions/route.ts',
  'app/api/goals/route.ts',
];

let importsOk = 0;
let importsFailed = 0;

routeFiles.forEach(file => {
  const fullPath = path.join(__dirname, '../', file);
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    if (content.includes("import { prisma } from '@/lib/prisma'")) {
      console.log(`  ✅ ${file} - Correct import`);
      importsOk++;
    } else if (content.includes('const prisma = new PrismaClient()')) {
      console.log(`  ⚠️  ${file} - NEEDS UPDATE (still has old import)`);
      importsFailed++;
    } else {
      console.log(`  ❓ ${file} - No Prisma import found`);
    }
  }
});

console.log('\n' + '='.repeat(70));
console.log('\n📊 SUMMARY:\n');
console.log(`  Total Checks: ${totalChecks}`);
console.log(`  ✅ Passed: ${passedChecks}`);
console.log(`  ❌ Failed: ${failedChecks}`);
console.log(`  Prisma Imports OK: ${importsOk}/${routeFiles.length}`);

if (failedChecks === 0 && importsFailed === 0) {
  console.log('\n🎉 ALL SYSTEMS GO! Ready for database setup.\n');
} else {
  console.log(`\n⚠️  ${failedChecks + importsFailed} issues found. See above for details.\n`);
}

console.log('='.repeat(70) + '\n');