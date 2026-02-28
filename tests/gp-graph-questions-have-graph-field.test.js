// gp-graph-questions-have-graph-field.test.js — "graph" type questions must have a graph field

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
  for (const q of data.questions) {
    if (q.type !== 'graph') continue;
    if (!q.graph || typeof q.graph !== 'object') {
      fail++;
      failures.push(`${file}: ${q.id} type="graph" but missing graph field`);
    } else { pass++; }
  }
}

console.log(`gp-graph-questions-have-graph-field: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} "graph" type questions have a graph field`);
