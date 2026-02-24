// gp-1352-graph-has-tolerance.test.js
// All graph objects must have a tolerance field (number > 0).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (typeof q.graph.tolerance === 'number' && q.graph.tolerance > 0) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' graph tolerance=' + q.graph.tolerance); }
  }
}
console.log('gp-1352-graph-has-tolerance: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' graphs have valid tolerance');
