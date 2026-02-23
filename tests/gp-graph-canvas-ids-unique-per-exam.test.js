// gp-graph-canvas-ids-unique-per-exam.test.js — each graph canvas_id must be unique within an exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const seen = new Set();
  let examOk = true;
  
  for (const q of data.questions) {
    if (!q.graph) continue;
    const cid = q.graph.canvas_id;
    if (!cid) continue;
    if (seen.has(cid)) {
      examOk = false;
      issues.push(`${file}: duplicate graph canvas_id '${cid}'`);
    }
    seen.add(cid);
  }
  
  if (examOk) {
    pass++;
  } else {
    fail++;
  }
}

console.log(`gp-graph-canvas-ids-unique-per-exam: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have unique graph canvas IDs`);
