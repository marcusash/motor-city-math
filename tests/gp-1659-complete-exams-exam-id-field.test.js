// gp-1659-complete-exams-exam-id-field.test.js
// All exam files must have a non-empty 'exam_id' field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.exam_id && typeof data.exam_id === 'string') pass++;
  else { fail++; failures.push(file + ': missing exam_id'); }
}
console.log('gp-1659-exam-id-field: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all exam files have exam_id (' + pass + ' checked)');
