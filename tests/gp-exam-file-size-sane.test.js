// gp-exam-file-size-sane.test.js — exam files should be between 1KB and 500KB (sanity check)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_BYTES = 1024;       // 1KB
const MAX_BYTES = 512 * 1024; // 512KB

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const stats = fs.statSync(path.join(DATA_DIR, file));
  const size = stats.size;
  if (size < MIN_BYTES || size > MAX_BYTES) {
    fail++;
    failures.push(`${file}: ${Math.round(size/1024)}KB — outside sane range (${Math.round(MIN_BYTES/1024)}-${Math.round(MAX_BYTES/1024)}KB)`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-file-size-sane: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exam files are within expected size range`);
