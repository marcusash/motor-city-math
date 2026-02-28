// gp-1105-y-range-min-less-than-max.test.js
// y_range[0] must be less than y_range[1] for all RP6-11 graphs.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const NEWER = [6, 7, 8, 9, 10, 11];

let pass = 0, fail = 0;
const failures = [];

for (const n of NEWER) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `retake-practice-${n}.json`), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || !Array.isArray(q.graph.y_range)) continue;
    const [min, max] = q.graph.y_range;
    if (min < max) { pass++; }
    else { fail++; failures.push(`RP${n}: ${q.id} y_range [${min}, ${max}] -- min not less than max`); }
  }
}

console.log(`gp-1105-y-range-min-less-than-max: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} y_range values have min < max`);
