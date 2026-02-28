// gp-graph-y-range-is-array.test.js — graph y_range must be [min, max] array format when present

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
    const yr = q.graph.y_range;
    if (!yr) { pass++; continue; }
    if (!Array.isArray(yr) || yr.length !== 2 || typeof yr[0] !== 'number' || typeof yr[1] !== 'number') {
      fail++;
      failures.push(`${file}: Q${q.id} y_range=${JSON.stringify(yr)} is not [min,max]`);
    } else if (yr[0] >= yr[1]) {
      fail++;
      failures.push(`${file}: Q${q.id} y_range=[${yr[0]},${yr[1]}] min >= max`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-y-range-is-array: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} graph y_range fields are valid [min,max] arrays`);
