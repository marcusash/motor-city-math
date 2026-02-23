// gp-1153-rp1-5-no-x-range.test.js
const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (const n of [1, 2, 3, 4, 5]) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-' + n + '.json'), 'utf8'));
  for (const q of data.questions.filter(q => q.graph)) {
    if (!q.graph.hasOwnProperty('x_range')) pass++;
    else { fail++; failures.push('RP' + n + ' ' + q.id + ' has unexpected x_range'); }
  }
}
console.log('gp-1153-rp1-5-no-x-range: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP1-5 graphs have no x_range field (' + pass + ' graphs)');
