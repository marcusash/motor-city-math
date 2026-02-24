// gp-1384-exam-schema-version-is-string.test.js
// Each exam must have a schema_version field that is a string.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (typeof data.schema_version === 'string' && data.schema_version.length > 0) pass++;
  else { fail++; failures.push(file + ': schema_version=' + JSON.stringify(data.schema_version)); }
}
console.log('gp-1384-exam-schema-version-is-string: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have string schema_version field');
