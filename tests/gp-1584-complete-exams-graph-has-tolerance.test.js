// gp-1584-complete-exams-graph-has-tolerance.test.js
// Every graph field must have a positive numeric 'tolerance'.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    const tol = q.graph.tolerance;
    if (typeof tol === 'number' && tol > 0) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' tolerance=' + tol); }
  }
}
console.log('gp-1584-graph-has-tolerance: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all graphs have positive tolerance (' + pass + ' checked)');
