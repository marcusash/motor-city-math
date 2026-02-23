// gp-key-points-are-number-pairs.test.js — each key_point must be [number, number]

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
    if (!q.graph) continue;
    for (const [idx, pt] of (q.graph.key_points || []).entries()) {
      if (!Array.isArray(pt) || pt.length !== 2 || typeof pt[0] !== 'number' || typeof pt[1] !== 'number') {
        fail++;
        failures.push(`${file}: Q${q.id} key_point[${idx}]=${JSON.stringify(pt)} is not [number,number]`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-key-points-are-number-pairs: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.slice(0, 5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} key_points are valid [x, y] number pairs`);
