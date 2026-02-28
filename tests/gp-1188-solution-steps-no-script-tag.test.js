// gp-1188-solution-steps-no-script-tag.test.js
// solution_steps strings must not contain script tags.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const step of (q.solution_steps || [])) {
      if (/<script/i.test(step)) { fail++; failures.push(file + ': ' + q.id + ' step has <script>'); }
      else pass++;
    }
  }
}
console.log('gp-1188-solution-steps-no-script-tag: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no script tags in solution_steps');
