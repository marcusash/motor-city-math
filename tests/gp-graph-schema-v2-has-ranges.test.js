// gp-graph-schema-v2-has-ranges.test.js — RP6-11 newer graph schema must have x_range and y_range

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
// RP6-11 use newer schema with x_range/y_range
const NEW_SCHEMA_FILES = ['retake-practice-6.json','retake-practice-7.json',
  'retake-practice-8.json','retake-practice-9.json','retake-practice-10.json',
  'retake-practice-11.json'];

let pass = 0;
let fail = 0;
const failures = [];

for (const file of NEW_SCHEMA_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const hasXRange = Array.isArray(q.graph.x_range) && q.graph.x_range.length === 2;
    const hasYRange = Array.isArray(q.graph.y_range) && q.graph.y_range.length === 2;
    if (!hasXRange || !hasYRange) {
      fail++;
      failures.push(`${file}: Q${q.id} missing x_range=${hasXRange} y_range=${hasYRange}`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-schema-v2-has-ranges: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} newer-schema graphs have x_range and y_range`);
