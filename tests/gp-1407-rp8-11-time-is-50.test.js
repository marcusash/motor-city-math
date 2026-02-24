// gp-1407-rp8-11-time-is-50.test.js
// RP8-11 must have time_minutes = 50.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 8; n <= 11; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.time_minutes === 50) pass++;
  else { fail++; failures.push(file + ': time_minutes=' + data.time_minutes); }
}
console.log('gp-1407-rp8-11-time-50: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' RP8-11 exams have time_minutes=50');
