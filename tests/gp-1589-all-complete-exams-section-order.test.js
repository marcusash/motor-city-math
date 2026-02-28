// gp-1589-all-complete-exams-section-order.test.js
// All complete exams must have section order A*3, B*8, C*2, D*2.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const EXPECTED = 'AAABBBBBBBBCCDD';
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const sections = data.questions.map(q => q.section).join('');
  if (sections === EXPECTED) pass++;
  else { fail++; failures.push(data.exam_id + ': got=' + sections + ' expected=' + EXPECTED); }
}
console.log('gp-1589-all-section-order: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all complete exams have section order AAABBBBBBBBCCDD');
