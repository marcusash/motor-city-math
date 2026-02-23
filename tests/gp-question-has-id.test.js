// gp-question-has-id.test.js — every question must have a non-empty id field

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
  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i];
    if (q.id && String(q.id).trim().length > 0) {
      pass++;
    } else {
      fail++;
      issues.push(`${file}: question at index ${i} has no 'id' field`);
    }
  }
}

console.log(`gp-question-has-id: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} questions have a non-empty id`);
