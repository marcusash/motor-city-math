// gp-1611-complete-exams-graph-canvas-id-nonempty.test.js
// Every graph field must have a non-empty 'canvas_id' string.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (q.graph.canvas_id && typeof q.graph.canvas_id === 'string') pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' graph missing canvas_id'); }
  }
}
console.log('gp-1611-graph-canvas-id: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all graphs have canvas_id (' + pass + ' checked)');
