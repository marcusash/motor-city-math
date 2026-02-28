// gp-1751-complete-exams-version-is-string.test.js
// version field must be a non-empty string.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (typeof data.version === 'string' && data.version.length > 0) pass++;
  else { fail++; failures.push(file + ' version=' + JSON.stringify(data.version)); }
}
console.log('gp-1751-version-is-string: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all complete exams have non-empty version string (' + pass + ' exams)');
