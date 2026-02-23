// gp-exam-time-minutes.test.js — verify time_minutes field exists and is a reasonable value

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_TIME = 10;
const MAX_TIME = 120;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const tm = data.time_minutes;
  
  if (tm === undefined || tm === null) {
    fail++;
    issues.push(`${file}: missing 'time_minutes' field`);
    continue;
  }
  
  const num = Number(tm);
  if (isNaN(num)) {
    fail++;
    issues.push(`${file}: 'time_minutes' is not a number: '${tm}'`);
  } else if (num < MIN_TIME || num > MAX_TIME) {
    fail++;
    issues.push(`${file}: 'time_minutes' = ${num} is out of expected range [${MIN_TIME}, ${MAX_TIME}]`);
  } else {
    pass++;
    console.log(`  OK: ${file} — ${num} minutes`);
  }
}

console.log(`gp-exam-time-minutes: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  FAIL:', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have valid time_minutes`);
