// gp-1147-rp1-7-section-a-uses-identify.test.js
const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (const n of [1, 2, 3, 4, 5, 6, 7]) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-' + n + '.json'), 'utf8'));
  for (const q of data.questions.filter(q => q.section === 'A')) {
    if (q.type === 'identify') pass++;
    else { fail++; failures.push('RP' + n + ' ' + q.id + ' type=' + q.type); }
  }
}
console.log('gp-1147-rp1-7-section-a-uses-identify: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP1-7 Section A all use identify type (' + pass + ' questions)');
