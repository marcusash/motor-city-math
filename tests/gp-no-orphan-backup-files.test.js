// gp-no-orphan-backup-files.test.js — every backup should correspond to a real exam file

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BACKUP_DIR = path.join(DATA_DIR, '_backups');

const exams = new Set(
  fs.readdirSync(DATA_DIR)
    .filter(f => /^retake-practice-\d+\.json$/.test(f))
    .map(f => f.replace('.json', ''))
);

let pass = 0;
let fail = 0;
const issues = [];

if (!fs.existsSync(BACKUP_DIR)) {
  console.log('gp-no-orphan-backup-files: 0 pass, 1 fail');
  console.log('  ERROR: backup directory does not exist');
  process.exit(1);
}

for (const bf of fs.readdirSync(BACKUP_DIR)) {
  // Backup names follow patterns:
  // - retake-practice-N.backup.json  (GP format)
  // - retake-practice-N-YYYY-MM-DD.json  (date suffix format)
  // - YYYY-MM-DDTxx-retake-practice-N.json  (timestamp prefix format)
  // Extract exam base name
  let base = bf.replace(/\.json$/, '');
  // Remove GP .backup suffix
  base = base.replace(/\.backup$/, '');
  // Remove timestamp prefix (e.g., 2026-02-23T04-17-37-916Z-)
  base = base.replace(/^\d{4}-\d{2}-\d{2}T[\d\-Z]+-/, '');
  // Remove date suffix (e.g., -2026-02-23)
  base = base.replace(/-\d{4}-\d{2}-\d{2}$/, '');
  
  if (exams.has(base)) {
    pass++;
  } else {
    fail++;
    issues.push(`_backups/${bf}: could not match exam for '${base}'`);
  }
}

console.log(`gp-no-orphan-backup-files: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} backup files all correspond to active exam files`);
