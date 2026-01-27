const fs = require('fs');
const path = require('path');

function findFilesWithPrisma(dir) {
  let results = [];
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      results = results.concat(findFilesWithPrisma(fullPath));
    } else if (file.name === 'route.ts') {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      if (content.includes('const prisma = new PrismaClient()')) {
        const relativePath = path.relative(
          path.join(__dirname, '../'),
          fullPath
        ).replace(/\\/g, '/');
        
        results.push(relativePath);
      }
    }
  });
  
  return results;
}

const apiDir = path.join(__dirname, '../app/api');
const filesNeedingUpdate = findFilesWithPrisma(apiDir);

console.log('\n📝 FILES THAT NEED MANUAL UPDATE:\n');
console.log('=' .repeat(60));

if (filesNeedingUpdate.length === 0) {
  console.log('✅ All files already updated!');
} else {
  filesNeedingUpdate.forEach((file, index) => {
    console.log(`\n${index + 1}. ${file}\n`);
    console.log('   FIND:    const prisma = new PrismaClient();');
    console.log('   DELETE:  ↑ This line');
    console.log('   ADD:     import { prisma } from "@/lib/prisma";');
    console.log('   PLACE:   At the top with other imports');
  });
}

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Total files to update: ${filesNeedingUpdate.length}\n`);