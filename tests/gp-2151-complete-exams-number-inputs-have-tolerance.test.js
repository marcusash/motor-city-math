// gp-2151-complete-exams-number-inputs-have-tolerance.test.js
// All number inputs should have a tolerance field for auto-grading in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  let examFail = false;
  for (const q of data.questions) {
    const noTol = (q.inputs||[]).filter(inp => inp.type === 'number' && (inp.tolerance === undefined || inp.tolerance === null));
    if (noTol.length > 0) { examFail = true; failures.push(data.exam_id + ' Q' + q.number + ' missing tolerance: ' + noTol.map(i=>i.id).join(',')); }
  }
  if (!examFail) pass++;
  else fail++;
}
console.log('gp-2151-number-inputs-have-tolerance: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All number inputs have tolerance in all 12 exams');
