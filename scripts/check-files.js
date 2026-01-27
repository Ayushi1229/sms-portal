const fs = require('fs');
const path = require('path');

const filesToCheck = [
  'app/api/auth/login/route.ts',
  'app/api/auth/me/route.ts',
  'app/api/students/route.ts',
  'app/api/students/[id]/route.ts',
  'app/api/mentors/route.ts',
  'app/api/sessions/route.ts',
  'app/api/goals/route.ts',
  'app/api/dashboard/route.ts',
];

console.log('📋 Checking which files exist:\n');

let found = 0;
let notFound = 0;

filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, '../', file);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ EXISTS: ${file}`);
    found++;
  } else {
    console.log(`❌ MISSING: ${file}`);
    notFound++;
  }
});

console.log(`\n📊 Summary: ${found} found, ${notFound} missing`);