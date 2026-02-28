// gp-1667-complete-exams-top-level-fields.test.js
// Lock the set of top-level fields in each complete exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const REQUIRED = new Set(['exam_id', 'title', 'time_minutes', 'version', 'questions']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const keys = new Set(Object.keys(data));
  const missing = [...REQUIRED].filter(k => !keys.has(k));
  if (missing.length === 0) pass++;
  else { fail++; failures.push(file + ': missing ' + missing.join(',')); }
}
console.log('gp-1667-top-level-fields: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all complete exams have required top-level fields (' + pass + ' checked)');
