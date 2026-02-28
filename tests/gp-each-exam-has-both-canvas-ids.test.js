// gp-each-exam-has-both-canvas-ids.test.js — each exam must have both graphQ12 and graphQ13

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
  const canvasIds = data.questions.filter(q => q.graph).map(q => q.graph.canvas_id);
  const hasQ12 = canvasIds.includes('graphQ12');
  const hasQ13 = canvasIds.includes('graphQ13');
  if (hasQ12 && hasQ13) { pass++; }
  else { fail++; failures.push(`${file}: missing ${!hasQ12 ? 'graphQ12' : 'graphQ13'}`); }
}

console.log(`gp-each-exam-has-both-canvas-ids: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have both graphQ12 and graphQ13 canvas IDs`);
