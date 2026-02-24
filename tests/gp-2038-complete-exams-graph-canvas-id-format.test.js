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
  for (const g of (data.graphs || [])) {
    if (PATTERN.test(g.canvas_id)) pass++;
    else { fail++; failures.push(data.exam_id + ' canvas_id=' + g.canvas_id); }
  }
}
console.log('gp-2038-canvas-id-format: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 24 graph canvas_ids match graphQ{N} format');
