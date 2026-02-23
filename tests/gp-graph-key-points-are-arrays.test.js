// gp-graph-key-points-are-arrays.test.js — graph key_points must be [[x,y]] format

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
    if (!q.graph || !q.graph.key_points) continue;
    const kp = q.graph.key_points;
    if (!Array.isArray(kp)) {
      fail++;
      failures.push(`${file}: Q${q.id} key_points is not an array`);
      continue;
    }
    let valid = true;
    for (const pt of kp) {
      if (!Array.isArray(pt) || pt.length !== 2 || typeof pt[0] !== 'number' || typeof pt[1] !== 'number') {
        fail++;
        failures.push(`${file}: Q${q.id} key_point ${JSON.stringify(pt)} is not [x,y]`);
        valid = false;
        break;
      }
    }
    if (valid) pass++;
  }
}

console.log(`gp-graph-key-points-are-arrays: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.slice(0, 5).forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} graph key_points are valid [x,y] arrays`);
