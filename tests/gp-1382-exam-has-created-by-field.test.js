// gp-1382-exam-has-created-by-field.test.js
// Each exam must have a non-empty created_by field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.created_by && typeof data.created_by === 'string' && data.created_by.trim().length > 0) pass++;
  else { fail++; failures.push(file + ': missing or empty created_by'); }
}
console.log('gp-1382-exam-has-created-by: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have non-empty created_by');
