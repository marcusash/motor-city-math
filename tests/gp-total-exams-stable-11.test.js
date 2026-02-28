// gp-total-exams-stable-11.test.js — regression guard: exactly 11 exam files

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BASELINE = 11;
const count = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).length;

console.log(`gp-total-exams-stable-11: ${count} exams (baseline: ${BASELINE})`);
if (count !== BASELINE) {
  console.log(`  FAIL: exam count changed from ${BASELINE} to ${count}`);
  process.exit(1);
}
console.log(`OK — exam count regression guard passed`);
