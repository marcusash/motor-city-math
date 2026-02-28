// gp-backup-files-have-questions.test.js — backup files must contain questions array

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'data', '_backups');
const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json'));

let pass = 0, fail = 0;
const failures = [];

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, file), 'utf8'));
  if (Array.isArray(data.questions) && data.questions.length > 0) { pass++; }
  else { fail++; failures.push(`${file}: missing or empty questions array`); }
}

console.log(`gp-backup-files-have-questions: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} backup files have questions`);
