// gp-1299-rp1-7-time-60-minutes.test.js
// RP1-7 must have time_minutes = 60.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 1; n <= 7; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.time_minutes === 60) pass++;
  else { fail++; failures.push(file + ': time_minutes=' + data.time_minutes + ' (expected 60)'); }
}
console.log('gp-1299-rp1-7-time-60: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP1-7 all have time_minutes=60');
