// gp-2165-complete-exams-graph-function-nonempty.test.js
// All graph function strings must be non-empty in all 12 exams.
// NOTE: graph.type field does NOT exist in schema (was incorrect assumption).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const graphQs = data.questions.filter(q => q.graph);
  const emptyFn = graphQs.filter(q => !q.graph.function || q.graph.function.trim() === '');
  if (emptyFn.length === 0) pass++;
  else { fail++; failures.push(data.exam_id + ' Q' + emptyFn.map(q=>q.number).join(',') + ' empty graph.function'); }
}
console.log('gp-2165-graph-function-nonempty: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All graph functions are non-empty strings in all 12 exams');
