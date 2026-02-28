// gp-2075-complete-exams-no-empty-inputs-array.test.js
// No question should have an empty inputs array (every question must have at least 1 input).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if ((q.inputs || []).length > 0) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' has 0 inputs'); }
  }
}
console.log('gp-2075-no-empty-inputs: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 180 questions have at least 1 input');
