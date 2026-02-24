// gp-2165-complete-exams-graph-type-field.test.js
// All graphs must have a type field in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const graphQs = data.questions.filter(q => q.graph);
  const noType = graphQs.filter(q => !q.graph.type || typeof q.graph.type !== 'string');
  if (noType.length === 0) pass++;
  else { fail++; failures.push(data.exam_id + ' Q' + noType.map(q=>q.number).join(',') + ' graph missing type'); }
}
console.log('gp-2165-graph-has-type: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All graphs have type field in all 12 exams');
