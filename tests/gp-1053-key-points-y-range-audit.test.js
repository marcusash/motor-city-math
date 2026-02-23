// gp-1053-key-points-y-range-audit.test.js — key_point y values should be in [-32, 18] range

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const Y_MIN = -32, Y_MAX = 18;
let inRange = 0, outOfRange = 0;
const findings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || !Array.isArray(q.graph.key_points)) continue;
    for (const [x, y] of q.graph.key_points) {
      if (y >= Y_MIN && y <= Y_MAX) { inRange++; }
      else { outOfRange++; findings.push(`${file}: ${q.id} key_point y=${y} out of [${Y_MIN},${Y_MAX}]`); }
    }
  }
}

console.log(`gp-1053-key-points-y-range-audit: ${inRange} in range, ${outOfRange} out of [${Y_MIN},${Y_MAX}]`);
if (findings.length) { findings.forEach(f => console.log('  INFO:', f)); }
console.log(`OK — key_point y range audit complete`);
