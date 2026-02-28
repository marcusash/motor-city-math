// gp-1143-graph-min-points-positive.test.js
const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.graph)) {
    if (typeof q.graph.min_points === 'number' && q.graph.min_points > 0) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' min_points=' + q.graph.min_points); }
  }
}
console.log('gp-1143-graph-min-points-positive: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' graph min_points are positive');
