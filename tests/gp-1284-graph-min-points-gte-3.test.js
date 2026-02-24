// gp-1284-graph-min-points-gte-3.test.js
// min_points in all graphs must be >= 3.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.graph)) {
    const mp = q.graph.min_points;
    if (typeof mp === 'number' && mp >= 3) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' min_points=' + mp); }
  }
}
console.log('gp-1284-graph-min-points-gte-3: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' graphs have min_points >= 3');
