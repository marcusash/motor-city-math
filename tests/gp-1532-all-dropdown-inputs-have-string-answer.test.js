// gp-1532-all-dropdown-inputs-have-string-answer.test.js
// All dropdown-type inputs must have a string answer.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'dropdown') continue;
      if (typeof inp.answer === 'string' && inp.answer.length > 0) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id + ' answer=' + inp.answer); }
    }
  }
}
console.log('gp-1532-dropdown-string-answer: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' dropdown inputs have string answers');
