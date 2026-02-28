// gp-1337-rp8-11-q1-is-quadratic.test.js
// RP8-11 Q1 (index 0) must always be type "quadratic".

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 8; n <= 11; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q1 = data.questions[0];
  if (q1 && q1.type === 'quadratic') pass++;
  else { fail++; failures.push(file + ': Q1 type=' + (q1 ? q1.type : 'missing')); }
}
console.log('gp-1337-rp8-11-q1-quadratic: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP8-11 Q1 is quadratic');
