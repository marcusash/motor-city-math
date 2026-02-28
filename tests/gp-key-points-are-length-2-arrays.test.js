// gp-key-points-are-length-2-arrays.test.js — every key_point must be an [x, y] pair

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
    for (let i = 0; i < q.graph.key_points.length; i++) {
      const pt = q.graph.key_points[i];
      if (Array.isArray(pt) && pt.length === 2 && isFinite(pt[0]) && isFinite(pt[1])) { pass++; }
      else { fail++; failures.push(`${file}: ${q.id} key_points[${i}]=${JSON.stringify(pt)} invalid`); }
    }
  }
}

console.log(`gp-key-points-are-length-2-arrays: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} key_points are valid [x, y] pairs`);
