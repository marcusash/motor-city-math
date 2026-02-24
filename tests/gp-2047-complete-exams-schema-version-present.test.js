// gp-2047-complete-exams-schema-version-present.test.js
// All 12 complete exams must have a schema_version field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (data.schema_version !== undefined && data.schema_version !== null) pass++;
  else { fail++; failures.push(file + ' schema_version=' + data.schema_version); }
}
console.log('gp-2047-schema-version: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 12 exams have schema_version field');
