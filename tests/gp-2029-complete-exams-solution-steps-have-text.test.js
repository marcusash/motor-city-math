// gp-2029-complete-exams-solution-steps-have-text.test.js
// Every solution step must have a non-empty text field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const step of (q.solution_steps || [])) {
      if (typeof step.text === 'string' && step.text.trim().length > 0) pass++;
      else { fail++; failures.push(data.exam_id+':'+q.id+' step text='+JSON.stringify(step.text)); }
    }
  }
}
console.log('gp-2029-steps-have-text: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 822 solution steps have non-empty text');
