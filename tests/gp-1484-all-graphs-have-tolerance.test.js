// gp-1484-all-graphs-have-tolerance.test.js
// Every graph must have a tolerance field that is a positive number.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const tol = q.graph.tolerance;
    if (typeof tol === 'number' && tol > 0) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' tolerance=' + tol); }
  }
}
console.log('gp-1484-graph-tolerance: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' graphs have positive tolerance');
