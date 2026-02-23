// gp-y-range-is-two-numbers.test.js — y_range must be [min, max] with 2 finite numbers

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
    if (!q.graph || !q.graph.y_range) continue;
    const yr = q.graph.y_range;
    if (!Array.isArray(yr) || yr.length !== 2 || !isFinite(yr[0]) || !isFinite(yr[1]) || yr[0] >= yr[1]) {
      fail++;
      failures.push(`${file}: ${q.id} invalid y_range: ${JSON.stringify(yr)}`);
    } else { pass++; }
  }
}

console.log(`gp-y-range-is-two-numbers: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} y_ranges are valid [min, max] pairs`);
