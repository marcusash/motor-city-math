// gp-graph-key-points-are-pairs.test.js — key_points must be [[x,y], [x,y]] pairs, not flat arrays

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
    const g = q.graph;
    if (!g || !g.key_points) continue;
    const kp = g.key_points;
    let valid = true;
    for (const point of kp) {
      if (!Array.isArray(point) || point.length !== 2 ||
          typeof point[0] !== 'number' || typeof point[1] !== 'number') {
        valid = false;
        failures.push(`${file}: Q${q.id} key_point ${JSON.stringify(point)} is not a [x,y] number pair`);
        break;
      }
    }
    if (valid) pass++; else fail++;
  }
}

console.log(`gp-graph-key-points-are-pairs: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} graph key_points are valid [x,y] pairs`);
