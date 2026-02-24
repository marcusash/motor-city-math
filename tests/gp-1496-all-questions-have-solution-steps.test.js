// gp-1496-all-questions-have-solution-steps.test.js
// Every question must have at least 1 solution step.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const count = (q.solution_steps || []).length;
    if (count >= 1) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' has 0 solution steps'); }
  }
}
console.log('gp-1496-all-have-solution-steps: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 165 questions have at least 1 solution step');
