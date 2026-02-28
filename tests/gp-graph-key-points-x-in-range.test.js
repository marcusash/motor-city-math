// gp-graph-key-points-x-in-range.test.js — graph key_point x values should be within typical display range

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_ABS = 1000;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || !Array.isArray(q.graph.key_points)) continue;
    for (const pt of q.graph.key_points) {
      if (!Array.isArray(pt) || pt.length !== 2) continue;
      if (Math.abs(pt[0]) > MAX_ABS || Math.abs(pt[1]) > MAX_ABS) {
        fail++;
        failures.push(`${file}: ${q.id} key_point [${pt[0]}, ${pt[1]}] out of range (max |${MAX_ABS}|)`);
      } else { pass++; }
    }
  }
}

console.log(`gp-graph-key-points-x-in-range: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} key_points are within display range (|x|,|y| <= ${MAX_ABS})`);
