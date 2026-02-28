// gp-1094-graph-q13-canvas-id.test.js
// Q13 (index 12) graph canvas_id must be "graphQ13".

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q13 = data.questions[12];
  if (q13 && q13.graph && q13.graph.canvas_id === 'graphQ13') { pass++; }
  else { fail++; failures.push(`${file}: Q13 canvas_id="${q13?.graph?.canvas_id}" (expected "graphQ13")`); }
}

console.log(`gp-1094-graph-q13-canvas-id: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} Q13 graphs use canvas_id "graphQ13"`);
