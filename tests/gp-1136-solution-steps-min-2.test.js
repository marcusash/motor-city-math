// gp-1136-solution-steps-min-2-per-question.test.js
const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const steps = (q.solution_steps || []).length;
    if (steps >= 2) pass++; else { fail++; failures.push(file + ': ' + q.id + ' only ' + steps + ' steps'); }
  }
}
console.log('gp-1136-solution-steps-min-2: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' questions have >= 2 solution steps');
