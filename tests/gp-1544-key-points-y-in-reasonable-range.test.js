// gp-1544-key-points-y-in-reasonable-range.test.js
// All graph key_point y-coordinates should be in [-50, 50].
// Note: RP10 Q12 has y=-32 (valid exponential range).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue; // skip incomplete exams
  for (const q of data.questions) {
    if (!q.graph) continue;
    for (const pt of (q.graph.key_points || [])) {
      const y = pt[1];
      if (typeof y === 'number' && Math.abs(y) <= 50) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ' y=' + y); }
    }
  }
}
console.log('gp-1544-key-points-y-range: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all key_point y-coordinates in [-50, 50]');
