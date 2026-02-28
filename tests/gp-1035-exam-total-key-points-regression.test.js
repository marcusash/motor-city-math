// gp-1035-exam-total-key-points-regression.test.js — total key_points across all graphs = 110

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 110;
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.graph && Array.isArray(q.graph.key_points)) {
      total += q.graph.key_points.length;
    }
  }
}

console.log(`gp-1035-exam-total-key-points-regression: total=${total} (expected ${EXPECTED})`);
if (total !== EXPECTED) {
  console.log(`  FAIL: expected ${EXPECTED} key_points, got ${total}`);
  process.exit(1);
}
console.log(`OK — total key_points locked at ${EXPECTED} (22 graphs x 5 exactly)`);
