// gp-no-duplicate-exam-ids-global.test.js — no two exams should share the same exam_id

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const seen = {};
let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const id = data.exam_id;
  if (seen[id]) {
    fail++;
    issues.push(`${file}: exam_id='${id}' already used by ${seen[id]}`);
  } else {
    seen[id] = file;
    pass++;
  }
}

console.log(`gp-no-duplicate-exam-ids-global: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} exams all have unique exam_id values`);
