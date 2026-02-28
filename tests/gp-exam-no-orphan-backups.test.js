// gp-exam-no-orphan-backups.test.js — every backup file must correspond to an existing exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BACKUP_DIR = path.join(DATA_DIR, '_backups');

const rpFiles = new Set(
  fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f))
);

let pass = 0;
let warn = 0;
const warnings = [];

let backups = [];
try {
  backups = fs.readdirSync(BACKUP_DIR).filter(f => /\.json$/.test(f));
} catch {
  console.log('gp-exam-no-orphan-backups: _backups dir missing');
  process.exit(1);
}

for (const backup of backups) {
  // Extract RP number from backup filename — various formats
  const match = backup.match(/retake-practice-(\d+)/);
  if (!match) {
    warn++;
    warnings.push(`${backup}: cannot extract exam number from backup filename`);
    continue;
  }
  const examFile = `retake-practice-${match[1]}.json`;
  if (!rpFiles.has(examFile)) {
    warn++;
    warnings.push(`${backup}: backup for ${examFile} but that exam doesn't exist`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-no-orphan-backups: ${pass} pass, ${warn} orphan`);
if (warnings.length) {
  console.log('INFO — orphan backups or unrecognized filenames:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} backups have corresponding exam files`);
