// gp-1353-graph-has-min-points.test.js
// All graph objects must have a min_points field (integer >= 3).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (typeof q.graph.min_points === 'number' && q.graph.min_points >= 3) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' graph min_points=' + q.graph.min_points); }
  }
}
console.log('gp-1353-graph-has-min-points: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' graphs have min_points >= 3');
