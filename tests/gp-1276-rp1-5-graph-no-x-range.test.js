// gp-1276-rp1-5-graph-no-x-range.test.js
// RP1-5 graph questions must NOT have x_range field (older schema).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 1; n <= 5; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.graph)) {
    if (!q.graph.hasOwnProperty('x_range')) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' has x_range (should not in RP1-5)'); }
  }
}
console.log('gp-1276-rp1-5-graph-no-x-range: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP1-5 all ' + pass + ' graphs have no x_range field (older schema)');
