// gp-exam-time-minutes-reasonable.test.js — time_minutes should be 30-90 for a practice exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_TIME = 20;
const MAX_TIME = 120;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const t = data.time_minutes;
  if (typeof t !== 'number' || t < MIN_TIME || t > MAX_TIME) {
    warn++;
    warnings.push(`${file}: time_minutes=${t} (expected ${MIN_TIME}-${MAX_TIME})`);
  } else {
    pass++;
    console.log(`  ${file}: ${t} min`);
  }
}

console.log(`gp-exam-time-minutes-reasonable: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — exams with unusual time limits:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have reasonable time limits`);
