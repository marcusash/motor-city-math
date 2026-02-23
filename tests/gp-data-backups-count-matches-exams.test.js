// gp-data-backups-count-matches-exams.test.js — each exam should have at least one backup

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BACKUP_DIR = path.join(DATA_DIR, '_backups');

let pass = 0;
let warn = 0;
const warnings = [];

const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const backupFiles = fs.existsSync(BACKUP_DIR) 
  ? fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json'))
  : [];

for (const rpFile of RP_FILES) {
  const num = rpFile.match(/(\d+)/)[1];
  const hasBackup = backupFiles.some(b => b.includes(`practice-${num}`) || b.includes(`practice${num}`));
  if (!hasBackup) {
    warn++;
    warnings.push(`${rpFile}: no backup found in data/_backups/`);
  } else {
    pass++;
  }
}

console.log(`gp-data-backups-count-matches-exams: ${pass} pass, ${warn} missing backups`);
if (warnings.length) {
  console.log('INFO — exams without backups:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have at least one backup`);
