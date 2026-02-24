// gp-1354-graph-function-has-x.test.js
// All graph function strings must contain the variable "x".

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || !q.graph.function) continue;
    if (q.graph.function.includes('x')) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' graph.function has no x: ' + q.graph.function); }
  }
}
console.log('gp-1354-graph-function-has-x: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' graph functions contain variable x');
