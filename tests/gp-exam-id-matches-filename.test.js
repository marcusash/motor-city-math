// gp-exam-id-matches-filename.test.js — exam_id in JSON should match the filename

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
  const expectedId = file.replace('.json', ''); // e.g. "retake-practice-3"
  
  if (!data.exam_id) {
    fail++;
    issues.push(`${file}: missing exam_id field`);
  } else if (data.exam_id === expectedId) {
    pass++;
  } else {
    fail++;
    issues.push(`${file}: exam_id='${data.exam_id}' expected '${expectedId}'`);
  }
}

console.log(`gp-exam-id-matches-filename: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have exam_id matching filename`);
