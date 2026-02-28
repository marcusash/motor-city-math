// gp-1058-per-exam-section-b-length.test.js — Section B must have exactly 8 questions per exam

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
  const bCount = data.questions.filter(q => q.section === 'B').length;
  if (bCount === EXPECTED) { pass++; }
  else { fail++; failures.push(`${file}: Section B has ${bCount} questions (expected ${EXPECTED})`); }
}

console.log(`gp-1058-per-exam-section-b-length: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have exactly ${EXPECTED} Section B questions`);
