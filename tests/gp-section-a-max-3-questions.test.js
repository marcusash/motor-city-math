// gp-section-a-max-3-questions.test.js — Section A must have EXACTLY 3 questions (not more)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 3;
let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const aCount = data.questions.filter(q => q.section === 'A').length;
  if (aCount !== EXPECTED) {
    fail++;
    failures.push(`${file}: Section A has ${aCount} questions (expected exactly ${EXPECTED})`);
  } else {
    pass++;
  }
}

console.log(`gp-section-a-max-3-questions: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have exactly 3 Section A questions`);
