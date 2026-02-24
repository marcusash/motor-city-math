// gp-1209-section-c-questions-all-have-graph.test.js
// All Section C questions (Q12 and Q13) must have a graph field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.section === 'C')) {
    if (q.graph) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' (Section C) has no graph field'); }
  }
}
console.log('gp-1209-section-c-all-have-graph: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' Section C questions have graph field');
