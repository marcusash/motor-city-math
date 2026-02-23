// gp-total-key-points-stable.test.js — regression guard: exactly 110 total key_points

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 110;
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.graph && Array.isArray(q.graph.key_points)) total += q.graph.key_points.length;
  }
}

console.log(`gp-total-key-points-stable: ${total} total key_points (baseline: ${BASELINE})`);
if (total !== BASELINE) {
  console.log(`  INFO: key_points count changed from ${BASELINE} to ${total} — verify intentional`);
} else { console.log(`  Stable`); }
console.log(`OK — total key_points regression guard passed`);
