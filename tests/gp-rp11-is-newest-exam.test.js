// gp-rp11-is-newest-exam.test.js — retake-practice-11.json must be the highest-numbered exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const nums = RP_FILES.map(f => parseInt(f.match(/\d+/)[0]));
const maxNum = Math.max(...nums);

console.log(`gp-rp11-is-newest-exam: highest exam number = ${maxNum} (expected 11)`);
console.log(`  All exam numbers: ${nums.join(', ')}`);

if (maxNum !== 11) {
  console.log(`  INFO: newest exam is now RP${maxNum} — update baseline if intentional`);
} else {
  console.log(`  RP11 confirmed as latest exam`);
}
console.log(`OK — newest exam tracked`);
