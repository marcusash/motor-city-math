// gp-all-exams-have-exam-id.test.js — every exam must have exam_id field

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
  const examId = data.exam_id;
  if (!examId || String(examId).trim() === '') {
    fail++;
    failures.push(`${file}: missing or empty exam_id`);
  } else {
    pass++;
    console.log(`  ${file}: exam_id='${examId}'`);
  }
}

console.log(`gp-all-exams-have-exam-id: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have a non-empty exam_id`);
