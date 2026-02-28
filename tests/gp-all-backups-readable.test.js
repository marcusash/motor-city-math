// gp-all-backups-readable.test.js — verify all backup files are readable valid JSON

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'data', '_backups');

if (!fs.existsSync(BACKUP_DIR)) {
  console.log('gp-all-backups-readable: SKIP — no _backups directory found');
  process.exit(0);
}

const backupFiles = fs.readdirSync(BACKUP_DIR)
  .filter(f => f.endsWith('.json'))
  .sort();

if (backupFiles.length === 0) {
  console.log('gp-all-backups-readable: WARN — _backups directory is empty');
  process.exit(0);
}

let pass = 0;
let fail = 0;
const issues = [];

for (const file of backupFiles) {
  const fullPath = path.join(BACKUP_DIR, file);
  try {
    const raw = fs.readFileSync(fullPath, 'utf8');
    const data = JSON.parse(raw);
    
    // Minimal validation: must have exam_id and questions array
    if (!data.exam_id && !data.id) {
      fail++;
      issues.push(`${file}: missing exam_id / id field`);
    } else if (!Array.isArray(data.questions)) {
      fail++;
      issues.push(`${file}: missing questions array`);
    } else {
      pass++;
    }
  } catch (e) {
    fail++;
    issues.push(`${file}: invalid JSON — ${e.message}`);
  }
}

console.log(`gp-all-backups-readable: ${pass} pass, ${fail} fail (${backupFiles.length} backup files)`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} backup files are valid JSON with required fields`);
