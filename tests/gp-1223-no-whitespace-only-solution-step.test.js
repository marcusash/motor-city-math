// gp-1223-no-whitespace-only-solution-step.test.js
// Solution steps must not be whitespace-only strings.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const step of (q.solution_steps || [])) {
      if (typeof step === 'string' && step.trim().length > 0) pass++;
      else { fail++; failures.push(file + ': ' + q.id + ' has whitespace-only or empty step'); }
    }
  }
}
console.log('gp-1223-no-whitespace-only-solution-step: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' solution steps are non-empty strings');
