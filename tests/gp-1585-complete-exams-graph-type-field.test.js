// gp-1585-complete-exams-graph-type-field.test.js
// Every graph field must have a graph_type, type, OR function field (schema variants).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    const gtype = q.graph.graph_type || q.graph.type || q.graph.function;
    if (gtype && typeof gtype === 'string' && gtype.trim().length > 0) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' missing graph_type/type/function'); }
  }
}
console.log('gp-1585-graph-type-field: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all graphs have graph_type, type, or function field (' + pass + ' checked)');
