// gp-1798-complete-exams-graph-tolerance-positive.test.js
// Graph tolerance must be a positive number (acceptable answer range).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, advisory = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    const t = q.graph.tolerance;
    if (t === undefined || t === null) { advisory++; continue; }
    if (typeof t === 'number' && t > 0) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' tolerance=' + t); }
  }
}
console.log('gp-1798-graph-tolerance: ' + pass + ' pass, ' + advisory + ' advisory (no tolerance field), ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all graph tolerance values are positive numbers (' + pass + ' graphs)');
