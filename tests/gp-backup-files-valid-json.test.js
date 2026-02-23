// gp-backup-files-valid-json.test.js — all backup files in data/_backups/ must be valid JSON

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'data', '_backups');

let pass = 0;
let fail = 0;
const failures = [];

if (!fs.existsSync(BACKUP_DIR)) {
  console.log('gp-backup-files-valid-json: 0 pass, 0 fail (no _backups directory)');
  console.log('OK — no backups to check');
  process.exit(0);
}

const backupFiles = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json')).sort();

for (const file of backupFiles) {
  try {
    const content = fs.readFileSync(path.join(BACKUP_DIR, file), 'utf8');
    JSON.parse(content);
    pass++;
  } catch (e) {
    fail++;
    failures.push(`${file}: ${e.message}`);
  }
}

console.log(`gp-backup-files-valid-json: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} backup files are valid JSON`);
