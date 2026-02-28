// gp-1957-complete-exams-graph-function-no-empty.test.js
// All graph function fields must be non-empty strings.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    const fn = q.graph.function || q.graph.graph_type;
    if (typeof fn === 'string' && fn.trim().length > 0) pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+' function/graph_type empty or missing'); }
  }
}
console.log('gp-1957-graph-function-non-empty: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' graphs have non-empty function/graph_type string');
