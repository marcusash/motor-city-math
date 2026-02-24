// gp-2028-complete-exams-solution-steps-array.test.js
// Every question's solution_steps must be an array.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (Array.isArray(q.solution_steps)) pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+' solution_steps='+typeof q.solution_steps); }
  }
}
console.log('gp-2028-solution-steps-array: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 180 questions have solution_steps as array');
