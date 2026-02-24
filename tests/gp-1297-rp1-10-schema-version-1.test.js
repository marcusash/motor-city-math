// gp-1297-rp1-10-schema-version-1.test.js
// RP1-10 must have schema_version = "1.0".

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 1; n <= 10; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const sv = data.schema_version;
  if (sv === '1.0') pass++;
  else { fail++; failures.push(file + ': schema_version=' + sv + ' (expected 1.0)'); }
}
console.log('gp-1297-rp1-10-schema-version: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP1-10 all have schema_version=1.0');
