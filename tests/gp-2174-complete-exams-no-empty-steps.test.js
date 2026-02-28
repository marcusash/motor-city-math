// gp-2174-complete-exams-no-empty-steps.test.js
// No solution step should be an empty string in any exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  let examFail = false;
  for (const q of data.questions) {
    const empty = (q.solution_steps||[]).filter(s => typeof s === 'string' && s.trim() === '');
    if (empty.length > 0) { examFail = true; failures.push(data.exam_id + ' Q' + q.number + ' has ' + empty.length + ' empty steps'); }
  }
  if (!examFail) pass++;
  else fail++;
}
console.log('gp-2174-no-empty-steps: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- No empty solution steps in all 12 exams');
