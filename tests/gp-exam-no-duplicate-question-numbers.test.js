// gp-exam-no-duplicate-question-numbers.test.js — question numbers within an exam must be unique

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
  const numbers = data.questions.map((q, i) => q.number || (i + 1));
  const dupes = numbers.filter((n, i, arr) => arr.indexOf(n) !== i);
  if (dupes.length > 0) {
    fail++;
    failures.push(`${file}: duplicate question numbers: ${[...new Set(dupes)].join(', ')}`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-no-duplicate-question-numbers: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have unique question numbers`);
