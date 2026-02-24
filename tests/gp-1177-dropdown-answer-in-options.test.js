// gp-1177-dropdown-answer-in-options.test.js
// Dropdown answer must be one of the option values.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || []).filter(i => i.type === 'dropdown')) {
      const opts = (inp.options || []);
      const optVals = opts.map(o => typeof o === 'string' ? o : o.value);
      if (optVals.includes(inp.answer)) pass++;
      else { fail++; failures.push(file + ': ' + q.id + ' inp=' + inp.id + ' answer="' + inp.answer + '" not in options'); }
    }
  }
}
console.log('gp-1177-dropdown-answer-in-options: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' dropdown answers are in their option sets');
