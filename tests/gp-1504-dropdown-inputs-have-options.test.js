// gp-1504-dropdown-inputs-have-options.test.js
// All dropdown inputs must have an options array with at least 2 items.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'dropdown') continue;
      if (Array.isArray(inp.options) && inp.options.length >= 2) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id + ' dropdown options=' + (inp.options ? inp.options.length : 'none')); }
    }
  }
}
console.log('gp-1504-dropdown-have-options: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' dropdown inputs have 2+ options');
