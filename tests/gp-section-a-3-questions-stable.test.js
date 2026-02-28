// gp-section-a-3-questions-stable.test.js — regression guard: each exam has exactly 3 Section A questions

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
  const sectionA = data.questions.filter(q => q.section === 'A').length;
  if (sectionA !== EXPECTED) {
    fail++;
    failures.push(`${file}: has ${sectionA} Section A questions (expected ${EXPECTED})`);
  } else { pass++; }
}

console.log(`gp-section-a-3-questions-stable: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have exactly ${EXPECTED} Section A questions`);
