// gp-1184-rp1-7-time-is-60.test.js
// RP1-7 must have time_minutes = 60.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (const n of [1, 2, 3, 4, 5, 6, 7]) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-' + n + '.json'), 'utf8'));
  if (data.time_minutes === 60) pass++;
  else { fail++; failures.push('RP' + n + ': time_minutes=' + data.time_minutes + ' (expected 60)'); }
}
console.log('gp-1184-rp1-7-time-is-60: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP1-7 all have time_minutes=60');
