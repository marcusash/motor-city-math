// gp-1581-complete-exams-graph-questions-have-graph-field.test.js
// Every question with type='graph' must have a 'graph' field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (q.type !== 'graph') continue;
    if (q.graph && typeof q.graph === 'object') pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' type=graph but missing graph field'); }
  }
}
console.log('gp-1581-graph-field-present: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all graph questions have graph field (' + pass + ' checked)');
