// gp-1533-all-radio-inputs-have-string-answer.test.js
// All radio-type inputs must have a string answer matching an option value.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'radio') continue;
      const validValues = new Set((inp.options || []).map(o => o.value || o));
      if (typeof inp.answer === 'string' && validValues.has(inp.answer)) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id + ' answer=' + inp.answer + ' valid=' + [...validValues].join(',')); }
    }
  }
}
console.log('gp-1533-radio-valid-answer: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' radio inputs have valid option answers');
