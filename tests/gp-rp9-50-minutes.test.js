// gp-rp9-50-minutes.test.js — RP9 must be 50 minutes (newer exam)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const file = path.join(DATA_DIR, 'retake-practice-9.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const EXPECTED = 50;
const t = data.time_minutes;

console.log(`gp-rp9-50-minutes: RP9 time_minutes=${t} (expected ${EXPECTED})`);
if (t !== EXPECTED) {
  console.log(`  FAIL: RP9 time_minutes changed to ${t}`);
  process.exit(1);
}
console.log(`OK — RP9 is ${EXPECTED} minutes`);
