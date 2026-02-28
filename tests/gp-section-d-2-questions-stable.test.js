// gp-section-d-2-questions-stable.test.js — regression guard: each exam has exactly 2 Section D questions

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
  const sectionD = data.questions.filter(q => q.section === 'D').length;
  if (sectionD !== EXPECTED) {
    fail++;
    failures.push(`${file}: has ${sectionD} Section D questions (expected ${EXPECTED})`);
  } else { pass++; }
}

console.log(`gp-section-d-2-questions-stable: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have exactly ${EXPECTED} Section D questions`);
