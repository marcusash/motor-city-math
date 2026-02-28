// gp-exam-time-minutes-is-number.test.js — time_minutes must be a positive integer

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const t = data.time_minutes;
  if (typeof t !== 'number' || !Number.isInteger(t) || t <= 0) {
    fail++;
    failures.push(`${file}: time_minutes=${JSON.stringify(t)} (must be positive integer)`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-time-minutes-is-number: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have positive integer time_minutes`);
