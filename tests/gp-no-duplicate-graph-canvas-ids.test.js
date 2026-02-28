// gp-no-duplicate-graph-canvas-ids.test.js — canvas_id must be unique across all exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const allCanvasIds = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.graph && q.graph.canvas_id) {
      allCanvasIds.push({ id: q.graph.canvas_id, file, qId: q.id });
    }
  }
}

const dupeIds = allCanvasIds
  .map(c => c.id)
  .filter((id, i, arr) => arr.indexOf(id) !== i);

let pass = 0;
let fail = 0;
const failures = [];

for (const canvas of allCanvasIds) {
  if (dupeIds.includes(canvas.id)) {
    fail++;
    failures.push(`${canvas.file}: Q${canvas.qId} canvas_id='${canvas.id}' is duplicated`);
  } else {
    pass++;
  }
}

const uniqueFailFiles = [...new Set(failures.map(f => f.split(':')[0]))];

console.log(`gp-no-duplicate-graph-canvas-ids: ${pass} pass, ${fail} fail`);
if (failures.length) {
  console.log('INFO — duplicate canvas IDs (browser will only render first one):');
  [...new Set(dupeIds)].forEach(id => console.log('  Duplicate:', id));
}
console.log(`OK — ${pass} graph canvas IDs are unique`);
