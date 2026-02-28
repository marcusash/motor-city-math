// gp-key-points-y-values-distribution.test.js — audit key_points Y value range across all graphs

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let minY = Infinity, maxY = -Infinity;
let pass = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || !Array.isArray(q.graph.key_points)) continue;
    for (const [, y] of q.graph.key_points) {
      if (isFinite(y)) {
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        pass++;
      }
    }
  }
}

console.log(`gp-key-points-y-values-distribution: ${pass} key_points audited`);
console.log(`  Y range: min=${minY}, max=${maxY}`);
console.log(`OK — Y value distribution audit complete`);
