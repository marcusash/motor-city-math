// gp-1481-per-exam-key-points-all-10.test.js
// Every exam has exactly 10 graph key_points (2 graphs x 5 points each).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const pts = data.questions.reduce((s, q) => s + ((q.graph && q.graph.key_points) || []).length, 0);
  if (pts === 10) pass++;
  else { fail++; failures.push(data.exam_id + ': key_points=' + pts); }
}
console.log('gp-1481-per-exam-key-points: ' + pass + '/11 all have 10');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- every exam has exactly 10 key_points (2 graphs x 5 pts)');
