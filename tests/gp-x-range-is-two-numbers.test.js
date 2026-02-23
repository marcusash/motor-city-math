// gp-x-range-is-two-numbers.test.js — x_range must be [min, max] with 2 finite numbers

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
    if (!q.graph || !q.graph.x_range) continue;
    const xr = q.graph.x_range;
    if (!Array.isArray(xr) || xr.length !== 2 || !isFinite(xr[0]) || !isFinite(xr[1]) || xr[0] >= xr[1]) {
      fail++;
      failures.push(`${file}: ${q.id} invalid x_range: ${JSON.stringify(xr)}`);
    } else { pass++; }
  }
}

console.log(`gp-x-range-is-two-numbers: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} x_ranges are valid [min, max] pairs`);
