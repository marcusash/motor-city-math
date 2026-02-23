// gp-graph-min-points-vs-key-points.test.js — min_points must not exceed actual key_points count

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
    const mp = q.graph.min_points;
    const kp = (q.graph.key_points || []).length;
    if (mp > kp) {
      fail++;
      failures.push(`${file}: Q${q.id} min_points=${mp} but only ${kp} key_points defined`);
    } else { pass++; }
  }
}

console.log(`gp-graph-min-points-vs-key-points: ${pass} pass, ${fail} inconsistent`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graphs have min_points <= actual key_points`);
