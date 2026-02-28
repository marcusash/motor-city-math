// gp-1363-radio-options-are-objects.test.js
// Radio inputs must have options as {value, text} objects.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'radio') continue;
      const opts = inp.options || [];
      for (const opt of opts) {
        if (typeof opt === 'object' && opt !== null && 'value' in opt && 'text' in opt) pass++;
        else { fail++; failures.push(file + ': ' + q.id + ' ' + inp.id + ' radio option invalid: ' + JSON.stringify(opt)); }
      }
    }
  }
}
console.log('gp-1363-radio-options-are-objects: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' radio options are {value, text} objects');
