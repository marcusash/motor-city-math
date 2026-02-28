// gp-older-exams-60-minutes.test.js — RP1-7 must all be 60 minutes (older exam batch)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OLDER_EXAMS = [1, 2, 3, 4, 5, 6, 7];
const EXPECTED = 60;

let pass = 0, fail = 0;
const failures = [];

for (const n of OLDER_EXAMS) {
  const file = path.join(DATA_DIR, `retake-practice-${n}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (data.time_minutes !== EXPECTED) {
    fail++;
    failures.push(`RP${n}: time_minutes=${data.time_minutes} (expected ${EXPECTED})`);
  } else { pass++; }
}

console.log(`gp-older-exams-60-minutes: ${pass} pass, ${fail} fail (RP1-7 should be ${EXPECTED}min)`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — RP1-7 are all ${EXPECTED} minutes`);
