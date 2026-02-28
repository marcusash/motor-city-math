// gp-exam-id-is-string.test.js — exam_id field must be a string, not number or null

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
  const id = data.exam_id;
  if (typeof id !== 'string' || !id.trim()) {
    fail++;
    issues.push(`${file}: exam_id='${id}' is ${typeof id} (must be non-empty string)`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-id-is-string: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} exams have string exam_id`);
