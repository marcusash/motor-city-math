// gp-1531-all-number-inputs-have-numeric-answer.test.js
// All number-type inputs must have a numeric answer (not string, not null).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'number') continue;
      if (typeof inp.answer === 'number' && isFinite(inp.answer)) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id + ' answer=' + inp.answer); }
    }
  }
}
console.log('gp-1531-number-answers-numeric: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0, 5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' number inputs have numeric finite answers');
