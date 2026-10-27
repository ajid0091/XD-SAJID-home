import fs from 'fs';
import path from 'path';
import { ALL_ANDROID_PROJECT_FILES } from '../src/android-source/project-manifest.ts';

const targetDir = path.resolve(process.cwd(), 'android-project', 'MayraAssistant');

console.log(`Writing ${Object.keys(ALL_ANDROID_PROJECT_FILES).length} Android files to ${targetDir}...`);

for (const [relPath, content] of Object.entries(ALL_ANDROID_PROJECT_FILES)) {
  const fullPath = path.join(targetDir, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf-8');
}

console.log('Successfully wrote all Android project files to disk!');
