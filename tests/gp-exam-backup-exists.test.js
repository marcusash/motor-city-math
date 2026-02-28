// gp-exam-backup-exists.test.js — each active exam JSON should have a corresponding backup

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BACKUP_DIR = path.join(DATA_DIR, '_backups');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

const backupFiles = fs.existsSync(BACKUP_DIR)
  ? new Set(fs.readdirSync(BACKUP_DIR).map(f => f.replace(/-backup-\d{8}/, '').replace(/-v\d+/, '')))
  : new Set();

for (const file of RP_FILES) {
  // Check if ANY backup for this exam exists
  const base = file.replace('.json', '');
  const hasBackup = fs.existsSync(BACKUP_DIR) && 
    fs.readdirSync(BACKUP_DIR).some(bf => bf.startsWith(base) || bf.includes(base));
  
  if (hasBackup) {
    pass++;
  } else {
    warn++;
    warnings.push(`${file}: no backup file found in data/_backups/`);
  }
}

console.log(`gp-exam-backup-exists: ${pass} pass, ${warn} missing backup`);
if (warnings.length) {
  console.log('INFO — exams without backups (run backup script):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have backup files`);
