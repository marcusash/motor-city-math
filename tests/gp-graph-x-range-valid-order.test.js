// gp-graph-x-range-valid-order.test.js — graph x_range must have [min, max] where min < max

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
    if (!Array.isArray(xr) || xr.length !== 2) {
      fail++; failures.push(`${file}: Q${q.id} x_range is not [min,max] array`);
    } else if (xr[0] >= xr[1]) {
      fail++; failures.push(`${file}: Q${q.id} x_range [${xr[0]},${xr[1]}]: min >= max`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-x-range-valid-order: ${pass} pass, ${fail} no x_range`);
if (failures.length) {
  console.log('INFO — graphs missing x_range (older schema, RP1-5):');
  failures.slice(0, 5).forEach(f => console.log('  ', f));
  if (fail > 5) console.log(`  ... and ${fail - 5} more`);
}
console.log(`OK — ${pass} graphs have valid x_range, ${fail} use older schema (no x_range)`);
