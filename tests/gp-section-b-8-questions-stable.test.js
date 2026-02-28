// gp-section-b-8-questions-stable.test.js — regression guard: each exam has exactly 8 Section B questions

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 8;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const sectionB = data.questions.filter(q => q.section === 'B').length;
  if (sectionB !== EXPECTED) {
    fail++;
    failures.push(`${file}: has ${sectionB} Section B questions (expected ${EXPECTED})`);
  } else { pass++; }
}

console.log(`gp-section-b-8-questions-stable: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have exactly ${EXPECTED} Section B questions`);
