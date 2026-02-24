// gp-1772-complete-exams-section-c-graph-type.test.js
// Section C questions (Q12-Q13) must be graph type.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const GRAPH_TYPES = new Set(['graph','rational']); // RP11 Q13 is 'rational'
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const secC = data.questions.filter(q => q.section === 'C');
  for (const q of secC) {
    if (GRAPH_TYPES.has(q.type)) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' type=' + q.type); }
  }
}
console.log('gp-1772-section-c-types: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all Section C questions are graph/rational (' + pass + ' checked)');
