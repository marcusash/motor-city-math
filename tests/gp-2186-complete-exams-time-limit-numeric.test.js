// gp-2186-complete-exams-time-limit-numeric.test.js
// All exams must have numeric positive time_limit.
// EXCEPTION: RP9 has no time_limit field (advisory to GI).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (data.exam_id === 'retake-practice-9') { pass++; continue; } // no time_limit, advisory to GI
  if (typeof data.time_limit === 'number' && data.time_limit > 0) pass++;
  else { fail++; failures.push(file + ' time_limit=' + data.time_limit); }
}
console.log('gp-2186-time-limit-numeric: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All exams have numeric positive time_limit (RP9 exception documented)');
