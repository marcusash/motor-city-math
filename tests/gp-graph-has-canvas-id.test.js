// gp-graph-has-canvas-id.test.js — every graph question has a canvas_id
// Missing canvas_id prevents Chart.js from finding the canvas element

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const GRAPH_TYPES = new Set(['graph', 'identify']);

let pass = 0;
let fail = 0;
let skip = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  for (const q of questions) {
    if (!q.graph) { skip++; continue; }
    if (!q.graph.canvas_id || typeof q.graph.canvas_id !== 'string' || !q.graph.canvas_id.trim()) {
      fail++;
      violations.push(`${file} Q${q.id || q.number}: graph missing canvas_id`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-has-canvas-id: ${pass} pass, ${fail} fail, ${skip} non-graph questions skipped`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — all graph questions have canvas_id');
