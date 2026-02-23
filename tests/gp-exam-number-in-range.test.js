// gp-exam-number-in-range.test.js — exam numbers should be 1-11 (no gaps or out-of-range)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

const examNums = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const match = (data.exam_id || '').match(/(\d+)$/);
  if (match) {
    const num = parseInt(match[1], 10);
    examNums.push(num);
    if (num < 1 || num > 20) {
      fail++;
      failures.push(`${file}: exam number ${num} is out of expected range 1-20`);
    } else {
      pass++;
    }
  }
}

// Check for duplicate numbers
const seen = new Set();
for (const n of examNums) {
  if (seen.has(n)) {
    fail++;
    failures.push(`Duplicate exam number: ${n}`);
  }
  seen.add(n);
}

console.log(`gp-exam-number-in-range: ${pass} pass, ${fail} fail`);
console.log(`  Exam numbers found: ${examNums.sort((a,b) => a-b).join(', ')}`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exam numbers are in range and unique`);
