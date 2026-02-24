// gp-1977-complete-exams-graph-key-points-are-pairs.test.js
// All key_points must be [x, y] numeric pairs.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    for (const pt of (q.graph.key_points||[])) {
      if (Array.isArray(pt) && pt.length === 2 && typeof pt[0]==='number' && typeof pt[1]==='number') pass++;
      else { fail++; failures.push(data.exam_id+':'+q.id+' key_point='+JSON.stringify(pt)); }
    }
  }
}
console.log('gp-1977-key-points-are-pairs: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' key_points are valid [x,y] numeric pairs');
