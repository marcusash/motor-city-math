// gp-exam-has-no-undefined-standard.test.js — every question must have a known standard (no undefined/null)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VALID_STANDARDS = /^W[23]\.[a-f]$/;
let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const std = q.standard;
    if (!std || !VALID_STANDARDS.test(std)) {
      fail++;
      failures.push(`${file}: Q${q.id} standard="${std}" is invalid`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-exam-has-no-undefined-standard: ${pass} pass, ${fail} invalid`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have valid standards (W2.a-W2.e, W3.a-W3.f)`);
