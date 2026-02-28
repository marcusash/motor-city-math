// gp-graph-canvas-id-matches-q-number.test.js — graph canvas_id should match graphQ{N} where N is Q position

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
  data.questions.forEach((q, idx) => {
    if (!q.graph) return;
    const qNum = idx + 1;
    const expectedId = `graphQ${qNum}`;
    const actualId = q.graph.canvas_id || '';
    if (actualId !== expectedId) {
      warn++;
      warnings.push(`${file}: Q${q.id} (pos ${qNum}) canvas_id="${actualId}" expected "${expectedId}"`);
    } else {
      pass++;
    }
  });
}

console.log(`gp-graph-canvas-id-matches-q-number: ${pass} pass, ${warn} mismatch`);
if (warnings.length) {
  console.log('INFO — canvas_id mismatches:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} graphs have matching canvas_id`);
