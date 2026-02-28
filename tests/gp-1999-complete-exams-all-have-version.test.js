// gp-1999-complete-exams-all-exams-have-version.test.js
// Every complete exam must have a version string.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (typeof data.version === 'string' && data.version.length > 0) pass++;
  else { fail++; failures.push(file.replace('.json','') + ' version=' + data.version); }
}
console.log('gp-1999-all-exams-have-version: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' complete exams have version string');
