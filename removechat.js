const fs = require('fs');
const path = require('path');

const filesToDelete = [
  'src/components/ChatHeader.tsx',
  'src/components/ChatInput.tsx',
  'src/components/MessageList.tsx',
  'src/components/ChatBox.tsx',
  'src/app/api/chat/route.ts',
  'src/lib/chat.ts',
];

const keywordsToRemove = [
  "import ChatHeader",
  "<ChatHeader />",
  "<ChatHeader/>",
];

const envVarsToClean = [
  "OPENAI_API_KEY",
  "ASTRA_DB_APPLICATION_TOKEN",
  "ASTRA_DB_ENDPOINT",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN"
];

function deleteFiles() {
  filesToDelete.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`🗑️ Deleted: ${file}`);
    }
  });
}

function cleanImportsInTSX(dir) {
  const tsxFiles = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

  tsxFiles.forEach(file => {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf-8');

    let modified = false;
    keywordsToRemove.forEach(keyword => {
      if (content.includes(keyword)) {
        content = content.replace(new RegExp(keyword + '.*\\n?', 'g'), '');
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf-8');
      console.log(`✂️ Cleaned: ${file}`);
    }
  });
}

function scanFolderRecursively(folder) {
  fs.readdirSync(folder).forEach(file => {
    const fullPath = path.join(folder, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanFolderRecursively(fullPath);
    } else if (file.endsWith('.tsx')) {
      cleanImportsInTSX(folder);
    }
  });
}

function cleanEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) return;

  let content = fs.readFileSync(envPath, 'utf-8');
  envVarsToClean.forEach(env => {
    content = content.replace(new RegExp(`${env}=.*`, 'g'), `${env}=`);
  });

  fs.writeFileSync(envPath, content, 'utf-8');
  console.log('🧼 Cleaned .env.local');
}

// Run all
deleteFiles();
scanFolderRecursively(path.join(__dirname, 'src'));
cleanEnvFile();

console.log('\n✅ Chat functionality removed successfully.');
