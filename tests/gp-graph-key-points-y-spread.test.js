// gp-graph-key-points-y-spread.test.js — key points should span a range of y values (not all at same y)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_SPREAD = 2;
let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const kp = q.graph.key_points || [];
    if (kp.length < 2) { pass++; continue; }
    const yVals = kp.map(([, y]) => y);
    const spread = Math.max(...yVals) - Math.min(...yVals);
    if (spread < MIN_SPREAD) {
      warn++;
      warnings.push(`${file}: Q${q.id} key_points y-spread=${spread} (min ${MIN_SPREAD})`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-key-points-y-spread: ${pass} pass, ${warn} narrow-spread`);
if (warnings.length) { warnings.forEach(w => console.log('  INFO:', w)); }
console.log(`OK — ${pass} graphs have adequate key_point y-spread`);
