// gp-1612-complete-exams-graph-canvas-ids-unique-per-exam.test.js
// canvas_ids must be unique within each exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const ids = data.questions.filter(q => q.graph && q.graph.canvas_id).map(q => q.graph.canvas_id);
  const unique = new Set(ids).size;
  if (unique === ids.length) pass++;
  else { fail++; failures.push(data.exam_id + ': ' + ids.length + ' graphs, ' + unique + ' unique canvas_ids'); }
}
console.log('gp-1612-canvas-ids-unique: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- canvas_ids unique within each exam (' + pass + ' exams checked)');
