// gp-1339-all-inputs-have-type.test.js
// All inputs must have a non-empty type field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type && typeof inp.type === 'string' && inp.type.trim().length > 0) pass++;
      else { fail++; failures.push(file + ': ' + q.id + ' input id=' + inp.id + ' missing type'); }
    }
  }
}
console.log('gp-1339-all-inputs-have-type: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' inputs have non-empty type');
