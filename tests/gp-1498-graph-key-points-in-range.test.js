// gp-1498-graph-key-points-in-range.test.js
// All graph key_points must be numeric pairs (not NaN, not Infinity).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    for (const pt of (q.graph.key_points || [])) {
      const [x, y] = pt;
      if (typeof x === 'number' && isFinite(x) && typeof y === 'number' && isFinite(y)) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ' bad point: ' + JSON.stringify(pt)); }
    }
  }
}
console.log('gp-1498-key-points-numeric: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' key_points are finite numeric pairs');
