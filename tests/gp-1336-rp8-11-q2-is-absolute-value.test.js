// gp-1336-rp8-11-q2-is-absolute-value.test.js
// RP8-11 Q2 (index 1) must always be type "absolute-value".

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 8; n <= 11; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q2 = data.questions[1];
  if (q2 && q2.type === 'absolute-value') pass++;
  else { fail++; failures.push(file + ': Q2 type=' + (q2 ? q2.type : 'missing')); }
}
console.log('gp-1336-rp8-11-q2-absolute-value: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP8-11 Q2 is absolute-value');
