// gp-1213-backup-question-count.test.js
// Each backup file must have exactly 15 questions.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const BACKUP_DIR = path.join(DATA_DIR, '_backups');
let pass = 0, fail = 0; const failures = [];
let backups = [];
try { backups = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json')).sort(); }
catch (e) { console.log('gp-1213-backup-question-count: backup dir missing'); process.exit(0); }

for (const file of backups) {
  const data = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, file), 'utf8'));
  const n = (data.questions || []).length;
  if (n === 15) pass++;
  else { fail++; failures.push(file + ': ' + n + ' questions (expected 15)'); }
}
console.log('gp-1213-backup-question-count: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' backup files have exactly 15 questions');
