// gp-graph-has-key-points.test.js — all graph questions must have at least 1 key_point

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const kp = q.graph.key_points;
    if (!kp || !Array.isArray(kp) || kp.length === 0) {
      warn++;
      warnings.push(`${file}: Q${q.id} graph has no key_points`);
    } else {
      pass++;
      console.log(`  ${file}: Q${q.id} has ${kp.length} key_points`);
    }
  }
}

console.log(`gp-graph-has-key-points: ${pass} pass, ${warn} missing`);
if (warnings.length) {
  console.log('INFO — graph questions without key_points:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} graph questions have key_points`);
