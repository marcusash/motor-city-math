// gp-1172-graph-canvas-id-format.test.js
// Graph canvas_id must be "graphQ12" or "graphQ13" for C-section questions.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID = new Set(['graphQ12', 'graphQ13']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.graph)) {
    if (VALID.has(q.graph.canvas_id)) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' canvas_id=' + q.graph.canvas_id); }
  }
}
console.log('gp-1172-graph-canvas-id-format: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' graph canvas IDs use graphQ12 or graphQ13');
