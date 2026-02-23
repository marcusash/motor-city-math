// gp-exam-question-count-exact.test.js — each exam must have exactly 15 questions (Kai's format)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 15;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.length;
  if (count === EXPECTED) {
    pass++;
  } else {
    fail++;
    issues.push(`${file}: ${count} questions (expected ${EXPECTED})`);
  }
}

console.log(`gp-exam-question-count-exact: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have exactly ${EXPECTED} questions`);
