// gp-section-c-2-questions-stable.test.js — regression guard: each exam has exactly 2 Section C questions

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
  const sectionC = data.questions.filter(q => q.section === 'C').length;
  if (sectionC !== EXPECTED) {
    fail++;
    failures.push(`${file}: has ${sectionC} Section C questions (expected ${EXPECTED})`);
  } else { pass++; }
}

console.log(`gp-section-c-2-questions-stable: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have exactly ${EXPECTED} Section C questions`);
