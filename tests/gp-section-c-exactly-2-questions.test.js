// gp-section-c-exactly-2-questions.test.js — Section C must have exactly 2 questions in every exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 2;
let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const cCount = data.questions.filter(q => q.section === 'C').length;
  if (cCount !== EXPECTED) {
    fail++;
    failures.push(`${file}: Section C has ${cCount} questions (expected exactly ${EXPECTED})`);
  } else {
    pass++;
  }
}

console.log(`gp-section-c-exactly-2-questions: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have exactly ${EXPECTED} Section C questions`);
