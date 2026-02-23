// gp-1093-graph-q12-canvas-id.test.js
// Q12 (index 11) graph canvas_id must be "graphQ12".

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
  const q12 = data.questions[11];
  if (q12 && q12.graph && q12.graph.canvas_id === 'graphQ12') { pass++; }
  else { fail++; failures.push(`${file}: Q12 canvas_id="${q12?.graph?.canvas_id}" (expected "graphQ12")`); }
}

console.log(`gp-1093-graph-q12-canvas-id: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} Q12 graphs use canvas_id "graphQ12"`);
