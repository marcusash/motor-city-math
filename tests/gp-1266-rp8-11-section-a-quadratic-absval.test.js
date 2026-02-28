// gp-1266-rp8-11-section-a-quadratic-absval.test.js
// RP8-11 Section A: Q1=quadratic, Q2/Q3=absolute-value.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 8; n <= 11; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const [q1, q2, q3] = data.questions;
  if (q1.type === 'quadratic') pass++; else { fail++; failures.push(file + ': Q1 type=' + q1.type + ' (expected quadratic)'); }
  if (q2.type === 'absolute-value') pass++; else { fail++; failures.push(file + ': Q2 type=' + q2.type + ' (expected absolute-value)'); }
  if (q3.type === 'absolute-value') pass++; else { fail++; failures.push(file + ': Q3 type=' + q3.type + ' (expected absolute-value)'); }
}
console.log('gp-1266-rp8-11-section-a-types: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP8-11 Section A types locked (quadratic, absolute-value, absolute-value)');
