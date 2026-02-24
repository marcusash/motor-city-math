// gp-1273-rp6-11-graph-has-y-range.test.js
// RP6-11 graph questions must have y_range array.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 6; n <= 11; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.graph)) {
    if (Array.isArray(q.graph.y_range) && q.graph.y_range.length === 2) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' missing y_range'); }
  }
}
console.log('gp-1273-rp6-11-graph-y-range: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP6-11 all ' + pass + ' graphs have y_range[2]');
