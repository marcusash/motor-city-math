// gp-all-questions-have-feedback-wrong.test.js — every question must have feedback_wrong

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
  for (const q of data.questions) {
    if (!q.feedback_wrong || String(q.feedback_wrong).trim() === '') {
      fail++;
      failures.push(`${file}: Q${q.id} missing feedback_wrong`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-all-questions-have-feedback-wrong: ${pass} pass, ${fail} missing`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have feedback_wrong`);
