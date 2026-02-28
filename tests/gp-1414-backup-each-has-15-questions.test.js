// gp-1414-backup-each-has-15-questions.test.js
// Each backup file must have exactly 15 questions.

const fs = require('fs'), path = require('path');
const BACKUP_DIR = path.join(__dirname, '..', 'data', '_backups');
const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json')).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, file), 'utf8'));
  const count = (data.questions || []).length;
  if (count === 15) pass++;
  else { fail++; failures.push(file + ': questions count=' + count); }
}
console.log('gp-1414-backup-15-questions: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' backup files have 15 questions');
