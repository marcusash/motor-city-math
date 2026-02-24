// gp-1984-complete-exams-graph-canvas-id-q12-q13-only.test.js
// Graph canvas_ids should follow graphQ12/graphQ13 pattern.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_CANVAS = /^graph[A-Z][0-9]+$/;
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    const cid = q.graph.canvas_id;
    if (VALID_CANVAS.test(cid)) pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+' canvas_id='+cid); }
  }
}
console.log('gp-1984-canvas-id-format: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' canvas_ids follow graphQ{N} format');
