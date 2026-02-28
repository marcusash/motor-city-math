// gp-exam-rp-sequence-is-complete.test.js — RP exams should be numbered 1-11 with no gaps

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f));

const nums = files.map(f => parseInt(f.match(/(\d+)/)[1])).sort((a,b) => a-b);
const expected = Array.from({length: nums[nums.length-1]}, (_, i) => i+1);
const missing = expected.filter(n => !nums.includes(n));

console.log(`gp-exam-rp-sequence-is-complete: exams found: ${nums.join(', ')}`);
if (missing.length > 0) {
  console.log(`  FAIL: missing exam numbers: ${missing.join(', ')}`);
  process.exit(1);
}
console.log(`OK — RP sequence is complete 1-${nums[nums.length-1]} (${nums.length} exams)`);
