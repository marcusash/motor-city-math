// gp-no-null-questions.test.js — questions array must not contain null or undefined entries

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
  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i];
    if (q === null || q === undefined) {
      fail++;
      failures.push(`${file}: questions[${i}] is ${q}`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-null-questions: ${pass} pass, ${fail} null/undefined`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — no null questions in any exam`);
