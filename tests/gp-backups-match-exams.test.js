// gp-backups-match-exams.test.js — each exam must have at least 1 backup

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BACKUP_DIR = path.join(DATA_DIR, '_backups');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];
const backupFiles = fs.existsSync(BACKUP_DIR) ? fs.readdirSync(BACKUP_DIR) : [];

for (const file of RP_FILES) {
  const base = path.basename(file, '.json');
  const hasBackup = backupFiles.some(b => b.startsWith(base));
  if (!hasBackup) {
    fail++;
    failures.push(`${file}: no backup found in _backups/`);
  } else { pass++; }
}

console.log(`gp-backups-match-exams: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have at least 1 backup`);
