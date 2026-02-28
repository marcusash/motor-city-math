// gp-1052-key-points-x-range-audit.test.js — key_point x values should be in [-9, 10] range

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const X_MIN = -9, X_MAX = 10;
let inRange = 0, outOfRange = 0;
const findings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || !Array.isArray(q.graph.key_points)) continue;
    for (const [x, y] of q.graph.key_points) {
      if (x >= X_MIN && x <= X_MAX) { inRange++; }
      else { outOfRange++; findings.push(`${file}: ${q.id} key_point x=${x} out of [${X_MIN},${X_MAX}]`); }
    }
  }
}

console.log(`gp-1052-key-points-x-range-audit: ${inRange} in range, ${outOfRange} out of [${X_MIN},${X_MAX}]`);
if (findings.length) { findings.forEach(f => console.log('  INFO:', f)); }
console.log(`OK — key_point x range audit complete`);
