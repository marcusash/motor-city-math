// gp-key-points-x-values-distribution.test.js — audit key_points X value range across all graphs

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let minX = Infinity, maxX = -Infinity;
let pass = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || !Array.isArray(q.graph.key_points)) continue;
    for (const [x] of q.graph.key_points) {
      if (isFinite(x)) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        pass++;
      }
    }
  }
}

console.log(`gp-key-points-x-values-distribution: ${pass} key_points audited`);
console.log(`  X range: min=${minX}, max=${maxX}`);
console.log(`OK — X value distribution audit complete`);
