// gp-1020-graph-canvas-id-format.test.js — canvas IDs should match "graphQN" format

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const CANVAS_RE = /^graphQ\d+$/;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const id = q.graph.canvas_id;
    if (typeof id === 'string' && CANVAS_RE.test(id)) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} canvas_id "${id}" doesn't match graphQN format`); }
  }
}

console.log(`gp-1020-graph-canvas-id-format: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graph canvas IDs match graphQN format`);
