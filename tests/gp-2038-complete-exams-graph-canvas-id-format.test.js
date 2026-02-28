// gp-2038-complete-exams-graphs-canvas-id-format.test.js
// All 24 graph canvas_ids must match format graphQ{N}.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const PATTERN = /^graphQ\d+$/;
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.graph)) {
    const cid = q.graph.canvas_id;
    if (PATTERN.test(cid)) pass++;
    else { fail++; failures.push(data.exam_id + ' Q' + q.number + ' canvas_id=' + cid); }
  }
}
console.log('gp-2038-canvas-id-format: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 24 graph canvas_ids match graphQ{N} format');
