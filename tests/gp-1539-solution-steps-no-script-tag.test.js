// gp-1539-solution-steps-no-script-tag.test.js
// solution_steps must not contain script tags (XSS guard).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const step of (q.solution_steps || [])) {
      if (typeof step === 'string' && step.toLowerCase().includes('<script')) {
        fail++; failures.push(data.exam_id + ':' + q.id);
      } else pass++;
    }
  }
}
console.log('gp-1539-steps-no-script: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no script tags in any solution step');
