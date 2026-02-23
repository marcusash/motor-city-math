// gp-exam-has-time-minutes.test.js — every exam must have a time_minutes field that is a positive number

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (typeof data.time_minutes === 'number' && data.time_minutes > 0) { pass++; }
  else { fail++; failures.push(`${file}: time_minutes=${data.time_minutes}`); }
}

console.log(`gp-exam-has-time-minutes: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have valid time_minutes`);
