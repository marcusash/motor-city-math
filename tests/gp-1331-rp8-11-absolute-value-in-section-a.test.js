// gp-1331-rp8-11-absolute-value-in-section-a.test.js
// RP8-11 must each have exactly 2 absolute-value questions (Q2/Q3 in Section A).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 8; n <= 11; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.filter(q => q.section === 'A' && q.type === 'absolute-value').length;
  if (count === 2) pass++;
  else { fail++; failures.push(file + ': absolute-value in A count=' + count + ' (expected 2)'); }
}
console.log('gp-1331-rp8-11-absval-in-a: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP8-11 each have 2 absolute-value questions in Section A');
