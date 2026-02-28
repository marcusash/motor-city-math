// gp-1486-graph-tolerance-within-range.test.js
// All graph tolerances must be between 0.1 and 2.0 (reasonable scoring range).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const tol = q.graph.tolerance;
    if (tol >= 0.1 && tol <= 2.0) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' tolerance=' + tol + ' out of [0.1,2.0]'); }
  }
}
console.log('gp-1486-tolerance-range: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all tolerances in [0.1, 2.0]');
