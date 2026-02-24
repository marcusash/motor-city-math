// gp-2153-complete-exams-solution-steps-are-strings.test.js
// All solution_steps must be plain strings (not objects) in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  let examFail = false;
  for (const q of data.questions) {
    const badSteps = (q.solution_steps||[]).filter(s => typeof s !== 'string');
    if (badSteps.length > 0) { examFail = true; failures.push(data.exam_id + ' Q' + q.number + ' non-string steps: ' + badSteps.length); }
  }
  if (!examFail) pass++;
  else fail++;
}
console.log('gp-2153-steps-are-strings: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All solution_steps are plain strings in all 12 exams');
