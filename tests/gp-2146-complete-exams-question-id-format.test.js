// gp-2146-complete-exams-question-id-format.test.js
// Question IDs should follow pattern: rp{N}-q{M} in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const bad = data.questions.filter(q => !/^rp\d+-q\d+$/.test(q.id));
  if (bad.length === 0) pass++;
  else { fail++; failures.push(data.exam_id + ' bad ids: ' + bad.map(q=>q.id).join(',')); }
}
console.log('gp-2146-question-id-format: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All question IDs match rp{N}-q{M} format');
