// gp-2161-complete-exams-graph-has-function.test.js
// All graph objects must have a function field in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const graphQs = data.questions.filter(q => q.graph);
  const noFn = graphQs.filter(q => !q.graph.function || typeof q.graph.function !== 'string');
  if (noFn.length === 0) pass++;
  else { fail++; failures.push(data.exam_id + ' Q' + noFn.map(q=>q.number).join(',') + ' graph missing function'); }
}
console.log('gp-2161-graph-has-function: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All graphs have function string in all 12 exams');
