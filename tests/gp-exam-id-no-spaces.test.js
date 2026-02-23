// gp-exam-id-no-spaces.test.js — exam_id must not contain spaces

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
  const id = String(data.exam_id || '');
  if (id.includes(' ')) {
    fail++;
    issues.push(`${file}: exam_id='${id}' contains spaces`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-id-no-spaces: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} exam_id values contain no spaces`);
