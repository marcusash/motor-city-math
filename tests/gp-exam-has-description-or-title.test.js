// gp-exam-has-description-or-title.test.js — exam should have exam_title (and ideally a description too)

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
  const title = data.exam_title || data.title || '';
  if (!title.trim()) {
    fail++;
    issues.push(`${file}: missing exam_title or title field`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-has-description-or-title: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} exams have a title field`);
