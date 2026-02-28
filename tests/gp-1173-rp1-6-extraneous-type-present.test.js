// gp-1173-rp1-6-extraneous-type-present.test.js
// RP1-6 each have exactly 1 "extraneous" type question. RP7-11 have none.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (const n of [1, 2, 3, 4, 5, 6]) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-' + n + '.json'), 'utf8'));
  const cnt = data.questions.filter(q => q.type === 'extraneous').length;
  if (cnt === 1) pass++; else { fail++; failures.push('RP' + n + ': ' + cnt + ' extraneous (expected 1)'); }
}
for (const n of [7, 8, 9, 10, 11]) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-' + n + '.json'), 'utf8'));
  const cnt = data.questions.filter(q => q.type === 'extraneous').length;
  if (cnt === 0) pass++; else { fail++; failures.push('RP' + n + ': ' + cnt + ' extraneous (expected 0)'); }
}
console.log('gp-1173-rp1-6-extraneous-type: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP1-6 have 1 extraneous each, RP7-11 have 0');
