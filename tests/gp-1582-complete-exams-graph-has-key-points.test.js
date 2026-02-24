// gp-1582-complete-exams-graph-has-key-points.test.js
// Every graph field must have a 'key_points' array with at least 3 entries.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    const pts = q.graph.key_points;
    if (Array.isArray(pts) && pts.length >= 3) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' key_points.length=' + (pts && pts.length)); }
  }
}
console.log('gp-1582-graph-key-points-min3: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all graphs have >=3 key_points (' + pass + ' checked)');
