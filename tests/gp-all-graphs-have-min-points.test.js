// gp-all-graphs-have-min-points.test.js — every graph must have a min_points field

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
    if (q.graph.min_points === undefined || q.graph.min_points === null) {
      fail++;
      failures.push(`${file}: Q${q.id} graph missing min_points`);
    } else { pass++; }
  }
}

console.log(`gp-all-graphs-have-min-points: ${pass} pass, ${fail} missing`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graphs have min_points field`);
