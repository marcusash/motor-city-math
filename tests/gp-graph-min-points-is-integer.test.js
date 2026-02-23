// gp-graph-min-points-is-integer.test.js — graph min_points (if present) must be positive integer

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || q.graph.min_points === undefined) continue;
    const mp = q.graph.min_points;
    if (!Number.isInteger(mp) || mp < 1) {
      fail++; failures.push(`${file}: Q${q.id} graph min_points=${mp} (expected positive integer)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-min-points-is-integer: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graph min_points are positive integers`);
