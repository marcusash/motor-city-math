// gp-1607-complete-exams-radio-inputs-have-options.test.js
// Radio-type inputs must have a non-empty 'options' array.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'radio') continue;
      if (Array.isArray(inp.options) && inp.options.length > 0) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id + ' missing options'); }
    }
  }
}
console.log('gp-1607-radio-has-options: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all radio inputs have options (' + pass + ' checked)');
