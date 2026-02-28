// gp-1246-section-c-questions-have-graph.test.js
// ALL Section C questions (Q12 and Q13) must have a graph field in all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const secC = data.questions.filter(q => q.section === 'C');
  for (const q of secC) {
    if (q.graph) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' Section C missing graph'); }
  }
}
console.log('gp-1246-section-c-all-have-graph: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' Section C questions have graph field');
