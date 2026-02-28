// gp-1356-rp6-11-graph-has-x-range.test.js
// RP6-11 graphs must have x_range field (newer schema).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 6; n <= 11; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (Array.isArray(q.graph.x_range) && q.graph.x_range.length === 2) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' missing x_range'); }
  }
}
console.log('gp-1356-rp6-11-graph-has-x-range: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' RP6-11 graphs have x_range [min, max]');
