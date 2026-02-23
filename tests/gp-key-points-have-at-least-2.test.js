// gp-key-points-have-at-least-2.test.js — each graph must have at least 2 key_points

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_POINTS = 2;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const kp = q.graph.key_points;
    if (!Array.isArray(kp) || kp.length < MIN_POINTS) {
      fail++;
      failures.push(`${file}: ${q.id} has ${Array.isArray(kp) ? kp.length : 0} key_points (min ${MIN_POINTS})`);
    } else { pass++; }
  }
}

console.log(`gp-key-points-have-at-least-2: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graphs have >= ${MIN_POINTS} key_points`);
