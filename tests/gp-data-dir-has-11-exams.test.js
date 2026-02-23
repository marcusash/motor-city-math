// gp-data-dir-has-11-exams.test.js — regression guard: data/ must have exactly 11 RP exam files

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BASELINE = 11;

const files = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f));

const count = files.length;
console.log(`gp-data-dir-has-11-exams: ${count} exam files (baseline: ${BASELINE})`);
if (count !== BASELINE) {
  console.log(`  FAIL: expected ${BASELINE} exams, found ${count}`);
  files.forEach(f => console.log('  -', f));
  process.exit(1);
}
console.log(`OK — exactly ${BASELINE} exam files in data/`);
