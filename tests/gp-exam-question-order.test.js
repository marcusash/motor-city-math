// gp-exam-question-order.test.js — verify questions are numbered sequentially starting at 1

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions;
  let examOk = true;
  
  for (let i = 0; i < questions.length; i++) {
    const expected = i + 1;
    const actual = questions[i].number;
    if (actual !== expected) {
      fail++;
      issues.push(`${file}: Q at index ${i} has number=${actual}, expected ${expected}`);
      examOk = false;
    }
  }
  if (examOk) pass++;
}

console.log(`gp-exam-question-order: ${pass} pass, ${fail} ordering issues`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have sequential 1-N question numbering`);
