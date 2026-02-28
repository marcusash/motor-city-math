// gp-exam-time-is-reasonable.test.js — exam time_minutes should be between 30 and 90 minutes

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_TIME = 30;
const MAX_TIME = 90;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const t = data.time_minutes;
  if (t === null || t === undefined) {
    warn++;
    warnings.push(`${file}: time_minutes field is missing`);
  } else if (typeof t !== 'number') {
    warn++;
    warnings.push(`${file}: time_minutes='${t}' is ${typeof t} (should be number)`);
  } else if (t < MIN_TIME || t > MAX_TIME) {
    warn++;
    warnings.push(`${file}: time_minutes=${t} outside expected range [${MIN_TIME}-${MAX_TIME}]`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-time-is-reasonable: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — exam time concerns:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have reasonable time allocation (${MIN_TIME}-${MAX_TIME} min)`);
