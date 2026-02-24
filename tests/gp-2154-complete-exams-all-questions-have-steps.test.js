// gp-2154-complete-exams-all-questions-have-steps.test.js
// Every question must have at least 1 solution step in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const noSteps = data.questions.filter(q => !q.solution_steps || q.solution_steps.length === 0);
  if (noSteps.length === 0) pass++;
  else { fail++; failures.push(data.exam_id + ' no steps Q' + noSteps.map(q=>q.number).join(',')); }
}
console.log('gp-2154-all-questions-have-steps: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All questions have at least 1 solution step in all 12 exams');
