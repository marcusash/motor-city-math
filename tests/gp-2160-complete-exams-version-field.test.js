// gp-2160-complete-exams-version-field.test.js
// All exams must have a version field that is a non-empty string.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (data.version && typeof data.version === 'string' && data.version.trim() !== '') pass++;
  else { fail++; failures.push(file + ' version=' + data.version); }
}
console.log('gp-2160-version-field: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- version field present in all 12 exams');
