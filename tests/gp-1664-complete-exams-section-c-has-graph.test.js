// gp-1664-complete-exams-section-c-has-graph.test.js
// Section C questions should include at least one graph type per exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const secC = data.questions.filter(q => q.section === 'C');
  const hasGraph = secC.some(q => q.type === 'graph');
  if (hasGraph) pass++;
  else { fail++; failures.push(data.exam_id + ': Section C types: ' + secC.map(q=>q.type).join(',')); }
}
console.log('gp-1664-section-c-has-graph: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all complete exams have graph in Section C (' + pass + ' checked)');
