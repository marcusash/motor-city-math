// gp-exam-id-numeric-suffix.test.js — exam_id suffix should be parseable as a number (e.g. 'retake-practice-7')

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
  const examId = data.exam_id || '';
  const match = examId.match(/(\d+)$/);
  if (!match || isNaN(parseInt(match[1], 10))) {
    fail++;
    failures.push(`${file}: exam_id='${examId}' has no numeric suffix`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-id-numeric-suffix: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have numeric suffix in exam_id`);
