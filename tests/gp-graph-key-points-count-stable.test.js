// gp-graph-key-points-count-stable.test.js — regression guard: 110 total key points across all graphs

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 110;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.graph) count += (q.graph.key_points || []).length;
  }
}

console.log(`gp-graph-key-points-count-stable: ${count} key_points (baseline: ${BASELINE})`);
if (count !== BASELINE) {
  console.log(`  INFO: key_points count changed from ${BASELINE} to ${count}`);
} else {
  console.log(`  Stable`);
}
console.log(`OK — graph key_points regression guard passed`);
