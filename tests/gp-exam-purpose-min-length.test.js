// gp-exam-purpose-min-length.test.js — purpose should be at least 20 chars to be meaningful

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_PURPOSE_LEN = 20;

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const p = (data.purpose || '').trim();
  if (p.length < MIN_PURPOSE_LEN) {
    fail++;
    failures.push(`${file}: purpose="${p}" is too short (${p.length} < ${MIN_PURPOSE_LEN} chars)`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-purpose-min-length: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have purpose with at least ${MIN_PURPOSE_LEN} chars`);
