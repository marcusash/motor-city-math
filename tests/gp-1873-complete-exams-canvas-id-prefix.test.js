// gp-1873-complete-exams-all-canvas-ids-have-prefix.test.js
// All canvas_ids in graphs must start with 'graph' prefix.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    const cid = q.graph.canvas_id;
    if (typeof cid === 'string' && cid.startsWith('graph')) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' canvas_id=' + cid); }
  }
}
console.log('gp-1873-canvas-id-prefix: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all canvas_ids start with "graph" (' + pass + ' graphs)');
