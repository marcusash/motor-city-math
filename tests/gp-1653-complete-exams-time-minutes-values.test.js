// gp-1653-complete-exams-time-minutes-values.test.js
// time_minutes must be 50 or 60 (known schema variants).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_TIMES = new Set([50, 60]);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (VALID_TIMES.has(data.time_minutes)) pass++;
  else { fail++; failures.push(file + ': time_minutes=' + data.time_minutes); }
}
console.log('gp-1653-time-minutes-values: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all time_minutes are 50 or 60 (' + pass + ' checked)');
