// gp-2018-complete-exams-time-minutes-valid-values.test.js
// time_minutes across all 12 complete exams must be exactly 50 or 60.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID = new Set([50, 60]);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (VALID.has(data.time_minutes)) pass++;
  else { fail++; failures.push(file.replace('.json','') + ' time_minutes=' + data.time_minutes); }
}
console.log('gp-2018-time-minutes-50-or-60: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 12 exams have time_minutes 50 or 60');
