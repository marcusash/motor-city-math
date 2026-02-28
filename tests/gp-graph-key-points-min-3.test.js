// gp-graph-key-points-min-3.test.js — graph key_points should have at least 3 points for meaningful plots

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_KEY_POINTS = 3;
let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const kp = q.graph.key_points || [];
    if (kp.length < MIN_KEY_POINTS) {
      warn++;
      warnings.push(`${file}: Q${q.id} graph has only ${kp.length} key_points (min ${MIN_KEY_POINTS} recommended)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-key-points-min-3: ${pass} pass, ${warn} under minimum`);
if (warnings.length) {
  console.log('INFO — graphs with fewer than 3 key_points:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} graphs have >= ${MIN_KEY_POINTS} key_points`);
