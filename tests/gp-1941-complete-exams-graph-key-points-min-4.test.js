// gp-1941-complete-exams-graph-key-points-min-4.test.js
// All graphs must have at least 4 key_points (enough to draw the curve).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    const n = (q.graph.key_points||[]).length;
    if (n >= 4) pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+' only '+n+' key_points'); }
  }
}
console.log('gp-1941-key-points-min-4: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' graphs have at least 4 key_points');
