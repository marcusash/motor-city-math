// gp-all-exams-have-questions.test.js — each exam must have at least 1 question (non-empty array)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (!data.questions || data.questions.length === 0) {
    fail++;
    failures.push(`${file}: has 0 questions`);
  } else { pass++; }
}

console.log(`gp-all-exams-have-questions: ${pass} pass, ${fail} empty`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have questions`);
