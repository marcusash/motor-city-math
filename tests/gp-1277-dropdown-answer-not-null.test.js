// gp-1277-dropdown-answer-not-null.test.js
// Dropdown inputs must have a non-null answer.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || []).filter(i => i.type === 'dropdown')) {
      if (inp.answer !== null && inp.answer !== undefined) pass++;
      else { fail++; failures.push(file + ': ' + q.id + '.' + inp.id + ' has null answer'); }
    }
  }
}
console.log('gp-1277-dropdown-answer-not-null: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' dropdown inputs have non-null answers');
