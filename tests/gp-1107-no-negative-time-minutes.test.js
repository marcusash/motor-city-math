// gp-1107-no-negative-time-minutes.test.js
// time_minutes must be a positive integer > 0.

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
  const t = data.time_minutes;
  if (Number.isInteger(t) && t > 0) { pass++; }
  else { fail++; failures.push(`${file}: time_minutes="${t}" (must be positive integer)`); }
}

console.log(`gp-1107-no-negative-time-minutes: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} exams have positive integer time_minutes`);
