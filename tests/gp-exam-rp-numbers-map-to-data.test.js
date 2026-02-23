// gp-exam-rp-numbers-map-to-data.test.js — exam_id number N in 'retake-practice-N' must match the file name N

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
  const fileNum = file.match(/retake-practice-(\d+)\.json/)[1];
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const examId = data.exam_id || '';
  const examNum = (examId.match(/retake-practice-(\d+)/) || [])[1];
  
  if (!examNum || examNum !== fileNum) {
    fail++;
    failures.push(`${file}: file says RP${fileNum} but exam_id='${examId}' implies RP${examNum}`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-rp-numbers-map-to-data: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exam file names match their exam_id`);
