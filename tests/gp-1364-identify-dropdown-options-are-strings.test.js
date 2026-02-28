// gp-1364-identify-dropdown-options-are-strings.test.js
// Section A "identify" type dropdown options must be plain strings (older schema).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.section === 'A' && q.type === 'identify')) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'dropdown') continue;
      const opts = inp.options || [];
      for (const opt of opts) {
        if (typeof opt === 'string') pass++;
        else { fail++; failures.push(file + ': ' + q.id + ' ' + inp.id + ' identify option not string: ' + JSON.stringify(opt)); }
      }
    }
  }
}
console.log('gp-1364-identify-dropdown-options-strings: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' identify dropdown options are strings');
