// gp-1228-graph-tolerance-not-zero.test.js
// Graph tolerance must be > 0 (non-zero tolerance required for grading).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.graph)) {
    const t = q.graph.tolerance;
    if (typeof t === 'number' && t > 0) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' tolerance=' + t); }
  }
}
console.log('gp-1228-graph-tolerance-not-zero: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' graphs have positive tolerance');
