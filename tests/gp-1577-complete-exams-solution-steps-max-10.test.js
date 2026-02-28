// gp-1577-complete-exams-solution-steps-max-10.test.js
// No question should have more than 10 solution_steps (data quality guard).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    const steps = (q.solution_steps || []).length;
    if (steps <= 10) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' steps=' + steps); }
  }
}
console.log('gp-1577-solution-steps-max-10: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all questions have <=10 solution_steps (' + pass + ' checked)');
