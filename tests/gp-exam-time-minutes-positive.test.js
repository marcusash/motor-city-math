// gp-exam-time-minutes-positive.test.js — time_minutes must be a positive integer

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];
const times = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const tm = data.time_minutes;
  times.push(`${file.replace('retake-practice-', 'RP').replace('.json', '')}=${tm}`);
  if (typeof tm !== 'number' || tm <= 0 || !Number.isInteger(tm)) {
    fail++;
    failures.push(`${file}: time_minutes=${JSON.stringify(tm)} (expected positive integer)`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-time-minutes-positive: ${pass} pass, ${fail} fail`);
console.log(`  Times: ${times.join(', ')}`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have positive integer time_minutes`);
