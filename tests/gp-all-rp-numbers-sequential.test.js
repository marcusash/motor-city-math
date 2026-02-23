// gp-all-rp-numbers-sequential.test.js — RP files must be numbered 1 through N with no gaps

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const rpNumbers = RP_FILES.map(f => parseInt(f.match(/retake-practice-(\d+)\.json/)[1]));
const sorted = [...rpNumbers].sort((a, b) => a - b);

let pass = 0;
let fail = 0;
const failures = [];

// Check they start at 1 and have no gaps
for (let i = 0; i < sorted.length; i++) {
  const expected = i + 1;
  if (sorted[i] !== expected) {
    fail++;
    failures.push(`Gap in RP numbering: expected RP${expected}, found RP${sorted[i]}`);
  } else {
    pass++;
  }
}

console.log(`gp-all-rp-numbers-sequential: ${pass} pass, ${fail} fail`);
console.log(`  RP files: ${sorted.map(n => `RP${n}`).join(', ')}`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — ${pass} RP exams numbered sequentially from 1 to ${sorted[sorted.length-1]}`);
