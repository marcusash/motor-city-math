// gp-exam-questions-not-empty-array.test.js — questions array must exist and not be empty

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
  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    fail++;
    failures.push(`${file}: questions is ${Array.isArray(data.questions) ? 'empty array' : typeof data.questions}`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-questions-not-empty-array: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have non-empty questions array`);
