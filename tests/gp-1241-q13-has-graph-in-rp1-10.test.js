// gp-1241-q13-has-graph-in-all-exams.test.js
// Q13 must have graph field in ALL 11 exams.
// Note: RP11 Q13 type is "rational" (anomaly) but still has a graph field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q13 = data.questions[12]; // index 12
  if (q13 && q13.graph) pass++;
  else { fail++; failures.push(file + ': Q13 missing graph field'); }
}
console.log('gp-1241-q13-has-graph-all-exams: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have graph on Q13 (including RP11 with rational type)');
