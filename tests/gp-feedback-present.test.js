// gp-feedback-present.test.js — every question must have feedback_correct and feedback_wrong fields

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
  for (const q of data.questions) {
    const hasCorrect = q.feedback_correct && String(q.feedback_correct).trim().length > 0;
    const hasWrong = q.feedback_wrong && String(q.feedback_wrong).trim().length > 0;

    if (hasCorrect) {
      pass++;
    } else {
      fail++;
      issues.push(`${file}: Q${q.id} missing feedback_correct`);
    }
    if (hasWrong) {
      pass++;
    } else {
      fail++;
      issues.push(`${file}: Q${q.id} missing feedback_wrong`);
    }
  }
}

console.log(`gp-feedback-present: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  if (fail > 0) process.exit(1);
}
if (fail === 0) console.log(`OK — all ${pass} feedback fields present`);

