// gp-all-graphs-have-exactly-5-key-points.test.js — regression guard: 5 key_points per graph

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BASELINE = 5;

const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const count = Array.isArray(q.graph.key_points) ? q.graph.key_points.length : -1;
    if (count === BASELINE) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} has ${count} key_points (expected ${BASELINE})`); }
  }
}

console.log(`gp-all-graphs-have-exactly-5-key-points: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graphs have exactly 5 key_points (regression guard)`);
