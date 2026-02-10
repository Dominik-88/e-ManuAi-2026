#!/usr/bin/env node

/**
 * Batch Import Migration Script
 * Automatically fixes all old @/ imports to new layer aliases
 * 
 * Usage: node scripts/batch-migrate.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// Migration patterns
const migrations = [
  // Infrastructure
  { from: /from ['"]@\/integrations\/supabase\/client['"]/g, to: "from '@infrastructure/database'" },
  { from: /from ['"]@\/types\/database['"]/g, to: "from '@infrastructure/database/types/database'" },
  { from: /from ['"]@\/contexts\/AuthContext['"]/g, to: "from '@infrastructure/auth'" },
  { from: /from ['"]@\/lib\/offline-queue['"]/g, to: "from '@infrastructure/offline'" },
  
  // Digital Twin
  { from: /from ['"]@\/lib\/telemetry-sync['"]/g, to: "from '@digital-twin/telemetry'" },
  { from: /from ['"]@\/lib\/barbieri-realtime['"]/g, to: "from '@digital-twin/telemetry/realtime-client'" },
  
  // AI Logic
  { from: /from ['"]@\/lib\/ai-context['"]/g, to: "from '@ai/assistant/context-builder'" },
  
  // Shared
  { from: /from ['"]@\/hooks\/useMachine['"]/g, to: "from '@shared/hooks/useMachine'" },
  { from: /from ['"]@\/hooks\/useBarbieriiClient['"]/g, to: "from '@shared/hooks/useBarbieriiClient'" },
  { from: /from ['"]@\/hooks\/useOfflineSync['"]/g, to: "from '@shared/hooks/useOfflineSync'" },
  { from: /from ['"]@\/hooks\/useOnlineStatus['"]/g, to: "from '@shared/hooks/useOnlineStatus'" },
  { from: /from ['"]@\/hooks\/useSunGlare['"]/g, to: "from '@shared/hooks/useSunGlare'" },
  { from: /from ['"]@\/hooks\/use-toast['"]/g, to: "from '@shared/hooks/use-toast'" },
  { from: /from ['"]@\/hooks\/use-mobile['"]/g, to: "from '@shared/hooks/use-mobile'" },
  { from: /from ['"]@\/lib\/utils['"]/g, to: "from '@shared/utils'" },
  
  // UI Components
  { from: /from ['"]@\/components\/ui\/([\w-]+)['"]/g, to: "from '@ui/components/ui/$1'" },
  { from: /from ['"]@\/components\/([\w/-]+)['"]/g, to: "from '@ui/components/$1'" },
  { from: /from ['"]@\/pages\/([\w/-]+)['"]/g, to: "from '@ui/pages/$1'" },
  { from: /from ['"]@\/styles\/([\w/-]+)['"]/g, to: "from '@ui/styles/$1'" },
  
  // Import statements (for imports without 'from')
  { from: /import ['"]@\/styles\/([\w/-]+)['"]/g, to: "import '@ui/styles/$1'" },
];

// Directories to scan
const dirsToScan = [
  '01_REALITY',
  '02_DIGITAL_TWIN',
  '03_AI_LOGIC',
  '04_USER_INTERFACE',
  '05_INFRASTRUCTURE',
  '06_SHARED',
  'src',
];

// Files to exclude
const excludePatterns = [
  /node_modules/,
  /dist/,
  /\.git/,
  /\.next/,
  /\.vercel/,
  /scripts\/batch-migrate\.js/,
];

let filesProcessed = 0;
let filesChanged = 0;

function shouldExclude(filePath) {
  return excludePatterns.some(pattern => pattern.test(filePath));
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    
    if (shouldExclude(fullPath)) return;
    
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (fullPath.match(/\.(ts|tsx)$/)) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let changeCount = 0;

  migrations.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      content = content.replace(from, to);
      changeCount += matches.length;
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesChanged++;
    return changeCount;
  }

  return 0;
}

console.log(`${colors.blue}🔄 Starting batch import migration...${colors.reset}\n`);

// Collect all files
let allFiles = [];
dirsToScan.forEach(dir => {
  allFiles = allFiles.concat(getAllFiles(dir));
});

console.log(`${colors.yellow}Found ${allFiles.length} TypeScript files${colors.reset}\n`);

// Process each file
allFiles.forEach(file => {
  filesProcessed++;
  const changes = migrateFile(file);
  
  if (changes > 0) {
    console.log(`${colors.green}✓${colors.reset} ${file} (${changes} changes)`);
  }
});

console.log(`\n${colors.green}✅ Migration complete!${colors.reset}`);
console.log(`${colors.yellow}Files processed: ${filesProcessed}${colors.reset}`);
console.log(`${colors.green}Files changed: ${filesChanged}${colors.reset}\n`);

console.log(`${colors.blue}Next steps:${colors.reset}`);
console.log(`1. Review changes: git diff`);
console.log(`2. Test build: npm run build`);
console.log(`3. Test runtime: npm run dev`);
console.log(`4. Commit: git add . && git commit -m "Complete import migration to layer aliases"`);
