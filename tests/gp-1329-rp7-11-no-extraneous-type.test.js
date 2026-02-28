// gp-1329-rp7-11-no-extraneous-type.test.js
// RP7-11 must have 0 questions of type "extraneous".

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 7; n <= 11; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.filter(q => q.type === 'extraneous').length;
  if (count === 0) pass++;
  else { fail++; failures.push(file + ': extraneous count=' + count + ' (expected 0)'); }
}
console.log('gp-1329-rp7-11-no-extraneous: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP7-11 all have 0 extraneous questions');
