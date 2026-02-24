// gp-1483-all-graphs-have-5-key-points.test.js
// Every graph must have exactly 5 key_points.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const pts = (q.graph.key_points || []).length;
    if (pts === 5) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' key_points=' + pts); }
  }
}
console.log('gp-1483-all-graphs-5-key-points: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' graphs have exactly 5 key_points');
