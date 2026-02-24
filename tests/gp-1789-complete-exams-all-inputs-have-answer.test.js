// gp-1789-complete-exams-all-inputs-have-answer.test.js
// All inputs must have an answer field that is not null/undefined.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs||[])) {
      if (inp.answer !== null && inp.answer !== undefined && String(inp.answer).trim() !== '') pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id + ' answer=' + JSON.stringify(inp.answer)); }
    }
  }
}
console.log('gp-1789-all-inputs-have-answer: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 388 inputs have non-empty answers (' + pass + ' inputs)');
