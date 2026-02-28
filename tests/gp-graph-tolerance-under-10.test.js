// gp-graph-tolerance-under-10.test.js — graph tolerance must be < 10 (sanity bound)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_TOL = 10;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const tol = q.graph.tolerance;
    if (typeof tol !== 'number' || tol >= MAX_TOL) {
      fail++;
      failures.push(`${file}: ${q.id} tolerance=${tol} (must be < ${MAX_TOL})`);
    } else { pass++; }
  }
}

console.log(`gp-graph-tolerance-under-10: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graph tolerances are < ${MAX_TOL}`);
