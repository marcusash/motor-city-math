// gp-1652-complete-exams-time-minutes-field.test.js
// All complete exams must have a positive numeric 'time_minutes' field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (typeof data.time_minutes === 'number' && data.time_minutes > 0) pass++;
  else { fail++; failures.push(file + ': time_minutes=' + data.time_minutes); }
}
console.log('gp-1652-time-minutes-field: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all complete exams have positive time_minutes (' + pass + ' checked)');
