// gp-each-exam-15-questions-stable.test.js — every exam must have exactly 15 questions

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 15;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.length;
  if (count !== EXPECTED) {
    fail++;
    failures.push(`${file}: has ${count} questions (expected exactly ${EXPECTED})`);
  } else { pass++; }
}

console.log(`gp-each-exam-15-questions-stable: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have exactly ${EXPECTED} questions`);
