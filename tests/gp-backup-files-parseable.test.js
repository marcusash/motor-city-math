// gp-backup-files-parseable.test.js — all backup JSON files must parse without errors

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'data', '_backups');
const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json'));

let pass = 0, fail = 0;
const failures = [];

for (const file of files) {
  try {
    JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, file), 'utf8'));
    pass++;
  } catch (e) {
    fail++;
    failures.push(`${file}: ${e.message}`);
  }
}

console.log(`gp-backup-files-parseable: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} backup files are valid JSON`);
