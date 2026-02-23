// gp-graph-x-range-is-array.test.js — graph x_range must be [min, max] array format

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
    const xr = q.graph.x_range;
    if (!xr) { pass++; continue; } // optional field, absent is ok
    if (!Array.isArray(xr) || xr.length !== 2 || typeof xr[0] !== 'number' || typeof xr[1] !== 'number') {
      fail++;
      failures.push(`${file}: Q${q.id} x_range=${JSON.stringify(xr)} is not [min,max]`);
    } else if (xr[0] >= xr[1]) {
      fail++;
      failures.push(`${file}: Q${q.id} x_range=[${xr[0]},${xr[1]}] min >= max`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-x-range-is-array: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} graph x_range fields are valid [min,max] arrays`);
