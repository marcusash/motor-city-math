// gp-exam-id-is-rp-format.test.js — exam_id should follow the 'retake-practice-{N}' naming convention

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const ID_PATTERN = /^retake-practice-\d+$/;

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const examId = data.exam_id;
  if (!examId || !ID_PATTERN.test(examId)) {
    fail++;
    failures.push(`${file}: exam_id='${examId}' does not match RP{N} format`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-id-is-rp-format: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have exam_id in retake-practice-{N} format`);
