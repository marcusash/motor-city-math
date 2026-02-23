// gp-feedback-correct-not-empty.test.js — feedback_correct must not be empty string

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
    const fc = q.feedback_correct;
    if (!fc || !String(fc).trim()) {
      fail++;
      issues.push(`${file}: Q${q.id} feedback_correct is empty`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-correct-not-empty: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} questions have non-empty feedback_correct`);
