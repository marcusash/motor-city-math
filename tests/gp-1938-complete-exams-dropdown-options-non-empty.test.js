// gp-1938-complete-exams-dropdown-options-non-empty.test.js
// All dropdown inputs must have at least 1 option.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) for (const inp of (q.inputs||[])) {
    if (inp.type !== 'dropdown') continue;
    if (Array.isArray(inp.options) && inp.options.length > 0) pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+':'+inp.id+' empty options'); }
  }
}
console.log('gp-1938-dropdown-options-non-empty: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' dropdown inputs have at least 1 option');
