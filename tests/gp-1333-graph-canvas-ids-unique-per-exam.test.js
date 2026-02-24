// gp-1333-graph-canvas-ids-unique-per-exam.test.js
// graphQ12 and graphQ13 canvas IDs must be distinct within each exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const graphQs = data.questions.filter(q => q.graph && q.graph.canvas_id);
  const ids = graphQs.map(q => q.graph.canvas_id);
  const uniq = new Set(ids);
  if (uniq.size === ids.length) pass++;
  else { fail++; failures.push(file + ': duplicate canvas IDs: ' + ids.join(', ')); }
}
console.log('gp-1333-graph-canvas-ids-unique: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have unique canvas IDs per exam');
