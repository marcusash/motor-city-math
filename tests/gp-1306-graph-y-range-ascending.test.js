// gp-1306-graph-y-range-ascending.test.js
// RP6-11 graph y_range must be ascending: [min, max] where min < max.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 6; n <= 11; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.graph && q.graph.y_range)) {
    const [lo, hi] = q.graph.y_range;
    if (lo < hi) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' y_range=[' + lo + ',' + hi + '] not ascending'); }
  }
}
console.log('gp-1306-graph-y-range-ascending: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' graph y_ranges are ascending [min, max]');
