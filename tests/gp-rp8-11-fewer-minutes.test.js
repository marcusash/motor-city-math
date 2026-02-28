// gp-rp8-11-fewer-minutes.test.js — RP8-11 should have time_minutes=50, RP1-7 should have time_minutes=60

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const EXPECTED_60 = [1,2,3,4,5,6,7];
const EXPECTED_50 = [8,9,10,11];

let pass = 0;
let fail = 0;
const failures = [];

for (const n of EXPECTED_60) {
  const file = `retake-practice-${n}.json`;
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.time_minutes !== 60) {
    fail++;
    failures.push(`RP${n}: expected 60min, got ${data.time_minutes}`);
  } else { pass++; }
}
for (const n of EXPECTED_50) {
  const file = `retake-practice-${n}.json`;
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.time_minutes !== 50) {
    fail++;
    failures.push(`RP${n}: expected 50min, got ${data.time_minutes}`);
  } else { pass++; }
}

console.log(`gp-rp8-11-fewer-minutes: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — RP1-7=60min, RP8-11=50min time distribution confirmed`);
