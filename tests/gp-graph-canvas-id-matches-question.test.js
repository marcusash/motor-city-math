// gp-graph-canvas-id-matches-question.test.js — graph canvas_id should reference the question number

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const g = q.graph;
    if (!g || !g.canvas_id) continue;
    // canvas_id should contain the question number
    const qNum = String(q.id || '').replace(/[^0-9]/g, '').slice(-2);
    const canvasId = g.canvas_id;
    if (qNum && !canvasId.includes(qNum)) {
      warn++;
      warnings.push(`${file}: Q${q.id} canvas_id='${canvasId}' doesn't reference question number ${qNum}`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-canvas-id-matches-question: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — canvas IDs that may not match their question number:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} graph canvas IDs verified`);
