// gp-graph-ymin-less-than-ymax.test.js — graph y axis: ymin must be < ymax

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
    const g = q.graph;
    if (!g) continue;
    const yMin = g.y_min !== undefined ? g.y_min : (g.yMin !== undefined ? g.yMin : null);
    const yMax = g.y_max !== undefined ? g.y_max : (g.yMax !== undefined ? g.yMax : null);
    if (yMin !== null && yMax !== null) {
      if (yMin >= yMax) {
        fail++;
        failures.push(`${file}: Q${q.id} graph ymin=${yMin} >= ymax=${yMax} (invalid axis)`);
      } else {
        pass++;
      }
    } else {
      pass++; // no explicit axis = ok
    }
  }
}

console.log(`gp-graph-ymin-less-than-ymax: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all graph y axes have valid ymin < ymax`);
