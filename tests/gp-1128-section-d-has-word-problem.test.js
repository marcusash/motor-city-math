// gp-1128-section-d-has-word-problem.test.js
// Every exam must have at least one word-problem in Section D.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const hasSectionDWP = data.questions
    .filter(q => q.section === 'D')
    .some(q => q.type === 'word-problem');
  if (hasSectionDWP) { pass++; }
  else { fail++; failures.push(`${file}: no word-problem in Section D`); }
}

console.log(`gp-1128-section-d-has-word-problem: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} exams have word-problem in Section D`);
