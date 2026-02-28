// gp-1797-complete-exams-key-points-are-pairs.test.js
// All key_points must be [number, number] pairs.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph || !Array.isArray(q.graph.key_points)) continue;
    for (const pt of q.graph.key_points) {
      if (Array.isArray(pt) && pt.length === 2 && typeof pt[0]==='number' && typeof pt[1]==='number') pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ' key_point=' + JSON.stringify(pt)); }
    }
  }
}
console.log('gp-1797-key-points-pairs: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all key_points are [number, number] pairs (' + pass + ' points)');
