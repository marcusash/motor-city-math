// gp-all-exams-have-backup.test.js — wrapper test for backup existence at test suite level

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BACKUP_DIR = path.join(DATA_DIR, '_backups');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

if (!fs.existsSync(BACKUP_DIR)) {
  console.log('gp-all-exams-have-backup: 0 pass, 1 fail');
  console.log('  ERROR: backup directory data/_backups/ does not exist');
  process.exit(1);
}

const backups = fs.readdirSync(BACKUP_DIR);

for (const file of RP_FILES) {
  const base = file.replace('.json', '');
  const hasBackup = backups.some(bf => bf.startsWith(base));
  if (hasBackup) {
    pass++;
  } else {
    fail++;
    issues.push(`${file}: no backup in _backups/`);
  }
}

console.log(`gp-all-exams-have-backup: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have at least one backup`);
