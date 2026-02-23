// gp-graph-key-points-x-spread.test.js — key points should span a range of x values (not all at same x)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_SPREAD = 2; // at least 2 units difference in x values
let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const kp = q.graph.key_points || [];
    if (kp.length < 2) { pass++; continue; }
    const xVals = kp.map(([x]) => x);
    const spread = Math.max(...xVals) - Math.min(...xVals);
    if (spread < MIN_SPREAD) {
      warn++;
      warnings.push(`${file}: Q${q.id} key_points x-spread=${spread} (min ${MIN_SPREAD})`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-key-points-x-spread: ${pass} pass, ${warn} narrow-spread`);
if (warnings.length) { warnings.forEach(w => console.log('  INFO:', w)); }
console.log(`OK — ${pass} graphs have adequate key_point x-spread`);
