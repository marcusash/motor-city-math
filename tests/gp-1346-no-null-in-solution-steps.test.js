// gp-1346-no-null-in-solution-steps.test.js
// No solution step should be null.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const step of (q.solution_steps || [])) {
      if (step !== null && step !== undefined) pass++;
      else { fail++; failures.push(file + ': ' + q.id + ' has null/undefined solution step'); }
    }
  }
}
console.log('gp-1346-no-null-in-solution-steps: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' solution steps are non-null');
