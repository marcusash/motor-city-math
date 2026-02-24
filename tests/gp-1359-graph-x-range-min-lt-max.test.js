// gp-1359-graph-x-range-min-lt-max.test.js
// RP6-11 graph x_range[0] must be < x_range[1].

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 6; n <= 11; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || !q.graph.x_range) continue;
    if (q.graph.x_range[0] < q.graph.x_range[1]) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' x_range invalid: ' + JSON.stringify(q.graph.x_range)); }
  }
}
console.log('gp-1359-graph-x-range-min-lt-max: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' RP6-11 graphs have valid x_range (min < max)');
