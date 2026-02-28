// gp-1344-solution-steps-is-array.test.js
// solution_steps must be an array in all questions.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (Array.isArray(q.solution_steps)) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' solution_steps type=' + typeof q.solution_steps); }
  }
}
console.log('gp-1344-solution-steps-is-array: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' solution_steps fields are arrays');
