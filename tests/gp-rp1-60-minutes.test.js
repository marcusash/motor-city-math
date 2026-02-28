// gp-rp1-60-minutes.test.js — RP1 must be 60 minutes (older exams are longer)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const file = path.join(DATA_DIR, 'retake-practice-1.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const EXPECTED = 60;
const t = data.time_minutes;

console.log(`gp-rp1-60-minutes: RP1 time_minutes=${t} (expected ${EXPECTED})`);
if (t !== EXPECTED) {
  console.log(`  FAIL: RP1 time_minutes changed to ${t}`);
  process.exit(1);
}
console.log(`OK — RP1 is ${EXPECTED} minutes`);
