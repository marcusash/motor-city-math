// gp-graph-canvas-id-naming-convention.test.js — graph canvas IDs should follow graphQ{N} pattern

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const CANVAS_PATTERN = /^graphQ\d+$/;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const cid = q.graph.canvas_id || '';
    if (CANVAS_PATTERN.test(cid)) {
      pass++;
    } else {
      warn++;
      warnings.push(`${file}: Q${q.id} canvas_id='${cid}' doesn't match graphQ{N} pattern`);
    }
  }
}

console.log(`gp-graph-canvas-id-naming-convention: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — non-standard canvas IDs:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} graph canvas IDs follow graphQ{N} naming convention`);
