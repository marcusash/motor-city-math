// gp-graph-tolerance-positive.test.js — graph tolerance (if present) must be > 0

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
    if (!q.graph || q.graph.tolerance === undefined) continue;
    const t = q.graph.tolerance;
    if (typeof t !== 'number' || t <= 0) {
      fail++; failures.push(`${file}: Q${q.id} graph tolerance=${t} (expected > 0)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-tolerance-positive: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graph tolerances are positive numbers`);
