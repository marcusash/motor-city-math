// gp-1669-complete-exams-graph-tolerance-range.test.js
// Graph tolerance must be in [0.1, 2.0] range.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    const t = q.graph.tolerance;
    if (typeof t === 'number' && t >= 0.1 && t <= 2.0) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' tolerance=' + t); }
  }
}
console.log('gp-1669-graph-tolerance-range: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all graph tolerances in [0.1, 2.0] (' + pass + ' graphs checked)');
