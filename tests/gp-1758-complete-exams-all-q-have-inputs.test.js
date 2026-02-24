// gp-1758-complete-exams-all-q-have-inputs.test.js
// Every question must have a non-empty inputs array.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (Array.isArray(q.inputs) && q.inputs.length > 0) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' has no inputs'); }
  }
}
console.log('gp-1758-all-q-have-inputs: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 180 questions have non-empty inputs array (' + pass + ' checked)');
