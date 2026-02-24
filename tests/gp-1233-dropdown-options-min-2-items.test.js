// gp-1233-dropdown-options-min-2-items.test.js
// Dropdown inputs must have at least 2 options.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || []).filter(i => i.type === 'dropdown')) {
      const opts = inp.options || [];
      if (opts.length >= 2) pass++;
      else { fail++; failures.push(file + ': ' + q.id + '.' + inp.id + ' has ' + opts.length + ' option(s)'); }
    }
  }
}
console.log('gp-1233-dropdown-options-min-2: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' dropdown inputs have >= 2 options');
