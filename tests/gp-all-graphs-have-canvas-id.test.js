// gp-all-graphs-have-canvas-id.test.js — every graph must have canvas_id field

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
    if (!q.graph.canvas_id || String(q.graph.canvas_id).trim() === '') {
      fail++;
      failures.push(`${file}: Q${q.id} graph missing canvas_id`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-all-graphs-have-canvas-id: ${pass} pass, ${fail} missing`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graphs have canvas_id`);
