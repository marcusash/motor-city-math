// gp-1825-complete-exams-version-is-string.test.js
// version field must be a non-empty string in all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (typeof data.version === 'string' && data.version.trim().length > 0) pass++;
  else { fail++; failures.push(file.replace('.json','') + ' version=' + JSON.stringify(data.version)); }
}
console.log('gp-1825-version-string: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all exam versions are non-empty strings (' + pass + ' exams)');
