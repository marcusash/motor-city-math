// gp-1748-complete-exams-plus-minus-boolean-lock.test.js
// All plus_minus fields must be boolean.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.plus_minus === undefined) { pass++; continue; } // optional field
      if (typeof inp.plus_minus === 'boolean') pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id + ' plus_minus=' + inp.plus_minus); }
    }
  }
}
console.log('gp-1748-plus-minus-boolean: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all plus_minus fields are boolean (' + pass + ' checked)');
