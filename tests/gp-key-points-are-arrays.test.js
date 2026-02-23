// gp-key-points-are-arrays.test.js — graph key_points must be array of arrays [[x,y],...]

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
    const kp = q.graph.key_points;
    if (!Array.isArray(kp)) {
      fail++;
      failures.push(`${file}: ${q.id} key_points is not an array`);
    } else {
      const badPoint = kp.find(p => !Array.isArray(p) || p.length !== 2);
      if (badPoint) {
        fail++;
        failures.push(`${file}: ${q.id} bad key_point: ${JSON.stringify(badPoint)}`);
      } else { pass++; }
    }
  }
}

console.log(`gp-key-points-are-arrays: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graphs have valid key_points format [[x,y],...]`);
