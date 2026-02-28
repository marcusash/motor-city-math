// gp-1285-all-exams-have-exam-id.test.js
// All exams must have a non-empty exam_id field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (typeof data.exam_id === 'string' && data.exam_id.trim().length > 0) pass++;
  else { fail++; failures.push(file + ': exam_id=' + data.exam_id); }
}
console.log('gp-1285-all-exams-have-exam-id: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have non-empty exam_id');
