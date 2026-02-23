// gp-graph-key-points-count-max.test.js — too many keypoints could cause rendering clutter (max 8)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_KEYPOINTS = 8;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const count = (q.graph.key_points || []).length;
    if (count > MAX_KEYPOINTS) {
      warn++;
      warnings.push(`${file}: Q${q.id} has ${count} keypoints (max recommended: ${MAX_KEYPOINTS})`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-key-points-count-max: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — graphs with many keypoints (may be cluttered):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} graphs have ${MAX_KEYPOINTS} or fewer keypoints`);
