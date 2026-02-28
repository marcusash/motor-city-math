// gp-all-graph-questions-have-canvas-id.test.js — graph questions must have a canvas_id for rendering

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (!q.graph.canvas_id || typeof q.graph.canvas_id !== 'string' || !q.graph.canvas_id.trim()) {
      fail++;
      failures.push(`${file}: Q${q.id} has graph but no canvas_id`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-all-graph-questions-have-canvas-id: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} graph questions have canvas_id`);
