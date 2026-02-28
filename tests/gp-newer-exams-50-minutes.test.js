// gp-newer-exams-50-minutes.test.js — RP8-11 must all be 50 minutes (newer exam batch)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const NEWER_EXAMS = [8, 9, 10, 11];
const EXPECTED = 50;

let pass = 0, fail = 0;
const failures = [];

for (const n of NEWER_EXAMS) {
  const file = path.join(DATA_DIR, `retake-practice-${n}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (data.time_minutes !== EXPECTED) {
    fail++;
    failures.push(`RP${n}: time_minutes=${data.time_minutes} (expected ${EXPECTED})`);
  } else { pass++; }
}

console.log(`gp-newer-exams-50-minutes: ${pass} pass, ${fail} fail (RP8-11 should be ${EXPECTED}min)`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — RP8-11 are all ${EXPECTED} minutes`);
