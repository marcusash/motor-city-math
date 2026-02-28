// gp-1488-solution-steps-no-null-string.test.js
// No solution step may contain the literal text "null".

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const step of (q.solution_steps || [])) {
      if (typeof step === 'string' && step.includes('null')) {
        fail++; failures.push(data.exam_id + ':' + q.id + ': "' + step.slice(0, 60) + '"');
      } else pass++;
    }
  }
}
console.log('gp-1488-steps-no-null: ' + pass + ' clean, ' + fail + ' contain "null"');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no solution step contains literal "null"');
