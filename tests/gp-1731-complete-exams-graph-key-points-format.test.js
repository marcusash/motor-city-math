// gp-1731-complete-exams-graph-key-points-format.test.js
// Each key_point in a graph must be an [x, y] pair of numbers.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    for (const kp of (q.graph.key_points || [])) {
      if (Array.isArray(kp) && kp.length === 2 && typeof kp[0] === 'number' && typeof kp[1] === 'number') pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ' invalid kp: ' + JSON.stringify(kp)); }
    }
  }
}
console.log('gp-1731-key-points-format: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all key_points are [number,number] pairs (' + pass + ' points)');
