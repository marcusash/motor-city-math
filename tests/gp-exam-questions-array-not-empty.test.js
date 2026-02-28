// gp-exam-questions-array-not-empty.test.js — questions array must have at least 1 question

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
  const qs = data.questions;
  if (!Array.isArray(qs) || qs.length === 0) {
    fail++;
    failures.push(`${file}: questions array is missing or empty`);
  } else {
    pass++;
    console.log(`  ${file}: ${qs.length} questions`);
  }
}

console.log(`gp-exam-questions-array-not-empty: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have non-empty questions array`);
