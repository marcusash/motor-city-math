// gp-1517-rp12-all-inputs-have-id.test.js
// All 29 RP12 inputs must have an id field.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
let pass = 0, fail = 0; const failures = [];
for (const q of data.questions) {
  for (const inp of (q.inputs || [])) {
    if (inp.id && typeof inp.id === 'string') pass++;
    else { fail++; failures.push(q.id + ': input missing id'); }
  }
}
console.log('gp-1517-rp12-input-ids: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' RP12 inputs have id');
