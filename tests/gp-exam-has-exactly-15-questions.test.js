// gp-exam-has-exactly-15-questions.test.js — structural gate: each exam must have exactly 15 questions

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const REQUIRED_COUNT = 15;
let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.length;
  if (count !== REQUIRED_COUNT) {
    fail++;
    failures.push(`${file}: has ${count} questions (required: ${REQUIRED_COUNT})`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-has-exactly-15-questions: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have exactly ${REQUIRED_COUNT} questions`);
