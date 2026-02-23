// gp-exam-number-in-filename-matches-id.test.js — exam_id suffix must match file number

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
  
  // exam_id might be "rp1", "retake-practice-1", etc. — extract numeric suffix
  const idNum = examId.match(/(\d+)$/);
  if (!idNum) {
    fail++; failures.push(`${file}: exam_id="${examId}" has no numeric suffix`);
  } else if (idNum[1] !== fileNum) {
    fail++; failures.push(`${file}: exam_id suffix "${idNum[1]}" != file number "${fileNum}"`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-number-in-filename-matches-id: ${pass} pass, ${fail} mismatch`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exam_id suffixes match their filename numbers`);
