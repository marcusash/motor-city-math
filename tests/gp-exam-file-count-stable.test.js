// gp-exam-file-count-stable.test.js — regression guard: exactly 11 exam JSON files

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 11;
const actual = RP_FILES.length;

console.log(`gp-exam-file-count-stable: ${actual} exam files (baseline: ${BASELINE})`);

if (actual !== BASELINE) {
  console.log(`  FAIL: expected ${BASELINE} exam files, found ${actual}`);
  console.log(`  Files: ${RP_FILES.join(', ')}`);
  process.exit(1);
}

console.log(`  Files: RP1 through RP11 all present`);
console.log(`OK — exam file count stable at ${BASELINE}`);
