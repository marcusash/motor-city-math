// gp-1698-complete-exams-canvas-id-format.test.js
// canvas_id must be non-empty string and unique within each exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const seen = new Set();
  for (const q of data.questions) {
    if (!q.graph) continue;
    const cid = q.graph.canvas_id;
    if (typeof cid === 'string' && cid.length > 0 && !seen.has(cid)) { seen.add(cid); pass++; }
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' canvas_id=' + JSON.stringify(cid)); }
  }
}
console.log('gp-1698-canvas-id-format: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all canvas_ids non-empty and unique within exam (' + pass + ' checked)');
