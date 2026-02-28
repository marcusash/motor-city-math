// gp-1244-solution-steps-not-empty-array.test.js
// solution_steps must not be an empty array.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const steps = q.solution_steps || [];
    if (steps.length > 0) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' has empty solution_steps'); }
  }
}
console.log('gp-1244-solution-steps-not-empty: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' questions have at least 1 solution step');
