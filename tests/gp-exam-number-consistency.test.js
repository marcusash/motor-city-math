// gp-exam-number-consistency.test.js — verify question number field matches position in array

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
  data.questions.forEach((q, idx) => {
    const expectedNumber = idx + 1;
    const actualNumber = q.number;
    if (actualNumber === expectedNumber) {
      pass++;
    } else {
      fail++;
      issues.push(`${file}: Q${q.id} at index ${idx} has number=${actualNumber}, expected ${expectedNumber}`);
    }
  });
}

console.log(`gp-exam-number-consistency: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} question numbers match their array position`);
