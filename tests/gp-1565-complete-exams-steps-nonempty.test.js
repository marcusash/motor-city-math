// gp-1565-complete-exams-solution-steps-nonempty.test.js
// Every question must have at least 1 solution_step.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (Array.isArray(q.solution_steps) && q.solution_steps.length >= 1) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' solution_steps.length=' + (q.solution_steps && q.solution_steps.length)); }
  }
}
console.log('gp-1565-solution-steps-nonempty: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all questions have >=1 solution_step (' + pass + ' checked)');
