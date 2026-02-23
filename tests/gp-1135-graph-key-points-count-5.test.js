// gp-1135-graph-key-points-count-5.test.js
// Every graph field must have exactly 5 key_points (locked baseline: 110 total across 22 graphs).

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
  for (const q of data.questions.filter(q => q.graph)) {
    const kp = (q.graph.key_points || []).length;
    if (kp === 5) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} has ${kp} key_points (expected 5)`); }
  }
}

console.log(`gp-1135-graph-key-points-count-5: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} graphs have exactly 5 key_points`);
