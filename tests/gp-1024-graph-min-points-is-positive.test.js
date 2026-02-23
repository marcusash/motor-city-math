// gp-1024-graph-min-points-is-positive.test.js — graph min_points must be positive integer

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
    if (!q.graph) continue;
    const mp = q.graph.min_points;
    if (Number.isInteger(mp) && mp > 0) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} min_points="${mp}" must be positive integer`); }
  }
}

console.log(`gp-1024-graph-min-points-is-positive: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graph min_points are positive integers`);
