// gp-1267-rp1-7-section-a-all-identify.test.js
// RP1-7 Section A (Q1/Q2/Q3) must all be type "identify".

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 1; n <= 7; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const secA = data.questions.filter(q => q.section === 'A');
  for (const q of secA) {
    if (q.type === 'identify') pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' type=' + q.type + ' (expected identify)'); }
  }
}
console.log('gp-1267-rp1-7-section-a-identify: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP1-7 Section A all identify type locked');
