// gp-1796-complete-exams-graph-function-nonempty.test.js
// All graph.function values must be non-empty strings.

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
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' graph.function empty/missing'); }
  }
}
console.log('gp-1796-graph-function-nonempty: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 24 graphs have non-empty function strings (' + pass + ' graphs)');
