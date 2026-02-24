// gp-1328-rp1-6-have-extraneous-type.test.js
// RP1-6 must each have exactly 1 question of type "extraneous".

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 1; n <= 6; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.filter(q => q.type === 'extraneous').length;
  if (count === 1) pass++;
  else { fail++; failures.push(file + ': extraneous count=' + count + ' (expected 1)'); }
}
console.log('gp-1328-rp1-6-extraneous-count: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP1-6 each have exactly 1 extraneous question');
