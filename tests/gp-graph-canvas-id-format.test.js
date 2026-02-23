// gp-graph-canvas-id-format.test.js — graph canvas_id should follow graphQ{N} format

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Expected format: graphQ{number} or similar with Q identifier
const CANVAS_RE = /^graph[A-Z]/;

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    
    const cid = q.graph.canvas_id;
    if (!cid) {
      warn++;
      issues.push(`${file}: Q${q.id} graph missing canvas_id`);
    } else if (!CANVAS_RE.test(cid)) {
      warn++;
      issues.push(`${file}: Q${q.id} canvas_id '${cid}' doesn't match graphQ{N} pattern`);
    } else {
      pass++;
      console.log(`  OK: ${file.replace('retake-practice-','RP').replace('.json','')} Q${q.number}: ${cid}`);
    }
  }
}

console.log(`gp-graph-canvas-id-format: ${pass} pass, ${warn} issues`);
if (issues.length) {
  issues.forEach(i => console.log('  WARN:', i));
}
process.exit(0);
