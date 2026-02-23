// gp-rp4-60-minutes.test.js — RP4 must be 60 minutes (older exam)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const file = path.join(DATA_DIR, 'retake-practice-4.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const EXPECTED = 60;
const t = data.time_minutes;

console.log(`gp-rp4-60-minutes: RP4 time_minutes=${t} (expected ${EXPECTED})`);
if (t !== EXPECTED) {
  console.log(`  FAIL: RP4 time_minutes changed to ${t}`);
  process.exit(1);
}
console.log(`OK — RP4 is ${EXPECTED} minutes`);
