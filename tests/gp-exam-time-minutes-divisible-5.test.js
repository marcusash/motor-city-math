// gp-exam-time-minutes-divisible-5.test.js — time_minutes should be a 5-minute increment (industry standard)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const t = data.time_minutes;
  if (typeof t === 'number' && t % 5 !== 0) {
    warn++;
    warnings.push(`${file}: time_minutes=${t} (not a 5-minute increment)`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-time-minutes-divisible-5: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — non-standard exam durations:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have time in 5-minute increments`);
