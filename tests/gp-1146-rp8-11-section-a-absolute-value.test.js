// gp-1146-rp8-11-section-a-uses-absolute-value.test.js
const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (const n of [8, 9, 10, 11]) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-' + n + '.json'), 'utf8'));
  const sectionA = data.questions.filter(q => q.section === 'A');
  const q2 = sectionA[1], q3 = sectionA[2];
  if (q2 && q2.type === 'absolute-value') pass++; else { fail++; failures.push('RP' + n + ' Q2 type=' + q2?.type); }
  if (q3 && q3.type === 'absolute-value') pass++; else { fail++; failures.push('RP' + n + ' Q3 type=' + q3?.type); }
}
console.log('gp-1146-rp8-11-section-a-absolute-value: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP8-11 Q2/Q3 all use absolute-value type');
