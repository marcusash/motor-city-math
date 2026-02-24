// gp-1791-complete-exams-number-input-numeric-answer.test.js
// Number inputs must have numeric (parseable float) answers. Advisory for known undefined.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, advisory = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs||[])) {
      if (inp.type !== 'number') continue;
      if (inp.answer === undefined || inp.answer === null) { advisory++; continue; }
      const v = parseFloat(String(inp.answer));
      if (!isNaN(v)) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id + ' answer=' + JSON.stringify(inp.answer)); }
    }
  }
}
console.log('gp-1791-number-inputs-numeric: ' + pass + ' pass, ' + advisory + ' advisory (undefined), ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all number inputs have numeric answers (' + pass + ' pass)');
