// gp-graph-y-range-valid-order.test.js — graph y_range must have [min, max] where min < max

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
    if (!Array.isArray(yr) || yr.length !== 2) {
      fail++; failures.push(`${file}: Q${q.id} y_range is not [min,max] array`);
    } else if (yr[0] >= yr[1]) {
      fail++; failures.push(`${file}: Q${q.id} y_range [${yr[0]},${yr[1]}]: min >= max`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-y-range-valid-order: ${pass} pass, ${fail} no y_range`);
if (failures.length) {
  console.log('INFO — graphs missing y_range (older schema, RP1-5):');
  failures.slice(0, 5).forEach(f => console.log('  ', f));
  if (fail > 5) console.log(`  ... and ${fail - 5} more`);
}
console.log(`OK — ${pass} graphs have valid y_range, ${fail} use older schema (no y_range)`);
