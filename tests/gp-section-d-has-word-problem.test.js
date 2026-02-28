// gp-section-d-has-word-problem.test.js — Section D must contain at least 1 word-problem per exam

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
  const secDWordProblems = data.questions.filter(q => q.section === 'D' && q.type === 'word-problem');
  if (secDWordProblems.length >= 1) { pass++; }
  else { fail++; failures.push(`${file}: Section D has no word-problem questions`); }
}

console.log(`gp-section-d-has-word-problem: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have word-problem in Section D`);
