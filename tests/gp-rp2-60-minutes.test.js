// gp-rp2-60-minutes.test.js — RP2 must be 60 minutes (older exam)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const file = path.join(DATA_DIR, 'retake-practice-2.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const EXPECTED = 60;
const t = data.time_minutes;

console.log(`gp-rp2-60-minutes: RP2 time_minutes=${t} (expected ${EXPECTED})`);
if (t !== EXPECTED) {
  console.log(`  FAIL: RP2 time_minutes changed to ${t}`);
  process.exit(1);
}
console.log(`OK — RP2 is ${EXPECTED} minutes`);
