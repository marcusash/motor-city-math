// gp-exam-all-exams-have-15-questions.test.js — every exam must have exactly 15 questions

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = (data.questions || []).length;
  if (count !== 15) {
    fail++;
    failures.push(`${file}: has ${count} questions (expected 15)`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-all-exams-have-15-questions: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have exactly 15 questions`);
