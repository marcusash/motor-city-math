// gp-1409-rp1-10-schema-version-is-1.test.js
// RP1-10 must have schema_version "1.0".

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 1; n <= 10; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.schema_version === '1.0') pass++;
  else { fail++; failures.push(file + ': schema_version=' + data.schema_version); }
}
console.log('gp-1409-rp1-10-schema-v1: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' RP1-10 exams have schema_version=1.0');
