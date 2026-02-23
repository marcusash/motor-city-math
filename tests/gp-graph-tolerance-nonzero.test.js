// gp-graph-tolerance-nonzero.test.js — graph tolerance must be > 0 (not zero, causes grading failures)

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
    if (!q.graph) continue;
    const tol = q.graph.tolerance;
    if (typeof tol !== 'number' || tol <= 0) {
      fail++;
      failures.push(`${file}: Q${q.id} graph.tolerance="${tol}" must be > 0`);
    } else { pass++; }
  }
}

console.log(`gp-graph-tolerance-nonzero: ${pass} pass, ${fail} invalid`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graphs have positive tolerance`);
