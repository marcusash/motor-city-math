// gp-1038-graph-key-points-are-2d.test.js — each key_point must be [x, y] (array of 2 numbers)

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
      if (Array.isArray(pt) && pt.length === 2 && pt.every(n => typeof n === 'number')) { pass++; }
      else { fail++; failures.push(`${file}: ${q.id} key_points[${i}]=${JSON.stringify(pt)} not [x,y]`); }
    }
  }
}

console.log(`gp-1038-graph-key-points-are-2d: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} key_points are valid [x,y] numeric arrays`);
