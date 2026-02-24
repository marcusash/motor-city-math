// gp-2185-complete-exams-all-exams-have-questions-array.test.js
// All 12 exam JSON files must have a questions array.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (Array.isArray(data.questions) && data.questions.length > 0) pass++;
  else { fail++; failures.push(file + ' questions=' + (Array.isArray(data.questions) ? data.questions.length : 'MISSING')); }
}
console.log('gp-2185-exams-have-questions: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All ' + pass + ' exam files have a questions array');
