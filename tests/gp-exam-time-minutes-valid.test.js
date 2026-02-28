// gp-exam-time-minutes-valid.test.js — exam time_minutes should be 45-90 (reasonable exam length)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_MINUTES = 45;
const MAX_MINUTES = 90;

let pass = 0;
let fail = 0;
let skipped = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const mins = data.time_minutes || data.duration_minutes;
  
  if (mins === undefined) {
    skipped++;
    continue;
  }
  
  if (mins >= MIN_MINUTES && mins <= MAX_MINUTES) {
    pass++;
  } else {
    fail++;
    issues.push(`${file}: time_minutes=${mins} out of range ${MIN_MINUTES}-${MAX_MINUTES}`);
  }
}

console.log(`gp-exam-time-minutes-valid: ${pass} pass, ${fail} fail, ${skipped} skipped`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} exams have valid time in ${MIN_MINUTES}-${MAX_MINUTES} min range`);
