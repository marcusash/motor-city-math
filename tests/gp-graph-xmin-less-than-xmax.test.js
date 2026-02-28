// gp-graph-xmin-less-than-xmax.test.js — graph x axis: xmin must be < xmax

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
    const xMin = g.x_min !== undefined ? g.x_min : (g.xMin !== undefined ? g.xMin : null);
    const xMax = g.x_max !== undefined ? g.x_max : (g.xMax !== undefined ? g.xMax : null);
    if (xMin !== null && xMax !== null) {
      if (xMin >= xMax) {
        fail++;
        failures.push(`${file}: Q${q.id} graph xmin=${xMin} >= xmax=${xMax} (invalid axis)`);
      } else {
        pass++;
      }
    } else {
      pass++; // no explicit axis = ok
    }
  }
}

console.log(`gp-graph-xmin-less-than-xmax: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all graph x axes have valid xmin < xmax`);
