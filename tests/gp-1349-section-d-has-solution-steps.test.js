// gp-1349-section-d-has-solution-steps.test.js
// Section D questions must have at least 3 solution steps (word problems need full work-shown).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.section === 'D')) {
    const stepCount = (q.solution_steps || []).length;
    if (stepCount >= 3) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' section D has only ' + stepCount + ' solution steps'); }
  }
}
console.log('gp-1349-section-d-solution-steps: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' section D questions have at least 3 solution steps');
