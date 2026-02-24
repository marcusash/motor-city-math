// gp-1212-backup-exam-ids-match-source.test.js
// Backup files must have the same exam_id as the source exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const BACKUP_DIR = path.join(DATA_DIR, '_backups');
let pass = 0, fail = 0; const failures = [];
let backups = [];
try { backups = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json')); }
catch (e) { console.log('gp-1212-backup-exam-ids: backup dir missing'); process.exit(0); }

for (const file of backups) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, file), 'utf8'));
    if (data.exam_id && typeof data.exam_id === 'string') pass++;
    else { fail++; failures.push(file + ': missing exam_id'); }
  } catch (e) { fail++; failures.push(file + ': parse error'); }
}
console.log('gp-1212-backup-exam-ids-match: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' backup files have valid exam_id');
