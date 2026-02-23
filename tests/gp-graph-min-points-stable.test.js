// gp-graph-min-points-stable.test.js — graph min_points values track stability

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];
const MIN_THRESHOLD = 1;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const mp = q.graph.min_points;
    if (typeof mp !== 'number' || mp < MIN_THRESHOLD) {
      fail++;
      failures.push(`${file}: ${q.id} min_points=${mp} (must be >= ${MIN_THRESHOLD})`);
    } else { pass++; }
  }
}

console.log(`gp-graph-min-points-stable: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graphs have valid min_points >= ${MIN_THRESHOLD}`);
