// gp-rp-exam-sequence-no-gaps.test.js — exam numbers must be contiguous with no gaps (1, 2, 3... no skips)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const nums = RP_FILES.map(f => parseInt(f.match(/\d+/)[0])).sort((a, b) => a - b);
const expected = Array.from({ length: nums.length }, (_, i) => i + 1);

const missing = expected.filter(n => !nums.includes(n));
const extra = nums.filter(n => !expected.includes(n));

console.log(`gp-rp-exam-sequence-no-gaps: exams ${nums.join(', ')}`);
if (missing.length > 0) {
  console.log(`  FAIL: Missing exam numbers: ${missing.join(', ')}`);
  process.exit(1);
}
if (extra.length > 0) {
  console.log(`  INFO: Unexpected exam numbers: ${extra.join(', ')}`);
}
console.log(`OK — exams are contiguous 1-${nums[nums.length-1]} with no gaps`);
