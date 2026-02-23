// gp-section-b-exactly-8-questions.test.js — Section B must have exactly 8 questions in every exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED_B = 8;
let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const bCount = data.questions.filter(q => q.section === 'B').length;
  if (bCount !== EXPECTED_B) {
    fail++;
    failures.push(`${file}: Section B has ${bCount} questions (expected ${EXPECTED_B})`);
  } else {
    pass++;
  }
}

console.log(`gp-section-b-exactly-8-questions: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have exactly ${EXPECTED_B} Section B questions`);
