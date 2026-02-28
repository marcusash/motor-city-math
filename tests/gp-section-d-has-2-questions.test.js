// gp-section-d-has-2-questions.test.js — Section D must have exactly 2 questions per exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 2;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.filter(q => q.section === 'D').length;
  if (count === EXPECTED) { pass++; }
  else { fail++; failures.push(`${file}: Section D has ${count} questions (expected ${EXPECTED})`); }
}

console.log(`gp-section-d-has-2-questions: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have exactly 2 Section D questions`);
