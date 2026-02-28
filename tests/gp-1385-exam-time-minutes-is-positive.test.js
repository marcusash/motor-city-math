// gp-1385-exam-time-minutes-is-positive.test.js
// time_minutes must be a positive integer in every exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (typeof data.time_minutes === 'number' && data.time_minutes > 0 && Number.isInteger(data.time_minutes)) pass++;
  else { fail++; failures.push(file + ': time_minutes=' + data.time_minutes); }
}
console.log('gp-1385-exam-time-minutes-positive: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have positive integer time_minutes');
