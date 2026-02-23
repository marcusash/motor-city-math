// gp-rp-latest-exam-is-rp11.test.js — the highest numbered RP exam should be retake-practice-11.json

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f));

const nums = files.map(f => parseInt(f.match(/(\d+)/)[1]));
const maxNum = Math.max(...nums);
const EXPECTED_MAX = 11;

console.log(`gp-rp-latest-exam-is-rp11: highest exam = RP${maxNum} (expected RP${EXPECTED_MAX})`);
if (maxNum < EXPECTED_MAX) {
  console.log(`  FAIL: max RP is ${maxNum}, expected at least ${EXPECTED_MAX}`);
  process.exit(1);
}
if (maxNum > EXPECTED_MAX) {
  console.log(`  INFO: newest exam is RP${maxNum} (${maxNum - EXPECTED_MAX} beyond milestone)`);
}
console.log(`OK — RP${maxNum} exists (${nums.length} exams total)`);
