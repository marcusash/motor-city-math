// gp-key-points-are-finite-numbers.test.js — all key_point coordinates must be finite numbers

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
    if (!q.graph || !Array.isArray(q.graph.key_points)) continue;
    for (const pt of q.graph.key_points) {
      if (!Array.isArray(pt) || pt.length !== 2) continue;
      if (!isFinite(pt[0]) || !isFinite(pt[1])) {
        fail++;
        failures.push(`${file}: ${q.id} has non-finite key_point: [${pt[0]}, ${pt[1]}]`);
      } else { pass++; }
    }
  }
}

console.log(`gp-key-points-are-finite-numbers: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} key_point coordinates are finite numbers`);
