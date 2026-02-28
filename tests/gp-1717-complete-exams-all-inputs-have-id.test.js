// gp-1717-complete-exams-all-inputs-have-id.test.js
// Every input must have an id field that is a non-empty string.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (typeof inp.id === 'string' && inp.id.length > 0) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ' input missing id'); }
    }
  }
}
console.log('gp-1717-all-inputs-have-id: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 388 inputs have non-empty id (' + pass + ' checked)');
