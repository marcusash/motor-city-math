// gp-section-a-has-3-questions.test.js — Section A must have exactly 3 questions per exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 3;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.filter(q => q.section === 'A').length;
  if (count === EXPECTED) { pass++; }
  else { fail++; failures.push(`${file}: Section A has ${count} questions (expected ${EXPECTED})`); }
}

console.log(`gp-section-a-has-3-questions: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have exactly 3 Section A questions`);
