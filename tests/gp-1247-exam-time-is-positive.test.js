// gp-1247-exam-time-is-positive.test.js
// time_minutes must be a positive number in all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const t = data.time_minutes;
  if (typeof t === 'number' && t > 0) pass++;
  else { fail++; failures.push(file + ': time_minutes=' + t); }
}
console.log('gp-1247-exam-time-positive: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have positive time_minutes');
