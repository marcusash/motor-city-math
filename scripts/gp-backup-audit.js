// gp-backup-audit.js — verify data/_backups/ has all 11 RP files and they parse cleanly

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BACKUP_DIR = path.join(DATA_DIR, '_backups');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();

console.log('\nGP Backup Audit');
console.log('='.repeat(50));

if (!fs.existsSync(BACKUP_DIR)) {
  console.log('FAIL — data/_backups/ directory does not exist');
  process.exit(1);
}

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  // Backups may have timestamp prefix or exact name
  const exactPath = path.join(BACKUP_DIR, file);
  const backupFiles = fs.readdirSync(BACKUP_DIR);
  const matchingBackup = backupFiles.find(f => f.endsWith(file));
  
  if (!matchingBackup) {
    fail++;
    issues.push(`MISSING: no backup found for ${file}`);
    continue;
  }
  try {
    const content = fs.readFileSync(path.join(BACKUP_DIR, matchingBackup), 'utf8');
    const data = JSON.parse(content);
    const qCount = (data.questions || []).length;
    console.log(`  OK: _backups/${matchingBackup} (${qCount} questions)`);
    pass++;
  } catch (e) {
    fail++;
    issues.push(`INVALID JSON: _backups/${matchingBackup} — ${e.message}`);
  }
}

console.log('='.repeat(50));
console.log(`Backup audit: ${pass}/${pass + fail} files healthy`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log('OK — all backups present and valid');
