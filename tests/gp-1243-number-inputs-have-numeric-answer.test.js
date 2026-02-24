// gp-1243-number-inputs-have-numeric-answer.test.js
// Number inputs must have a numeric answer (parseFloat succeeds and is finite).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || []).filter(i => i.type === 'number')) {
      const v = parseFloat(String(inp.answer));
      if (isFinite(v)) pass++;
      else { fail++; failures.push(file + ': ' + q.id + '.' + inp.id + ' answer=' + inp.answer); }
    }
  }
}
console.log('gp-1243-number-inputs-numeric-answer: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' number inputs have finite numeric answers');
