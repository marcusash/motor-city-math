// gp-graph-keypoints-arrays.test.js — all keypoints must be [x, y] arrays (not objects)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const kps = q.graph.key_points || [];
    for (let i = 0; i < kps.length; i++) {
      const kp = kps[i];
      if (Array.isArray(kp) && kp.length === 2 && kp.every(v => typeof v === 'number')) {
        pass++;
      } else {
        fail++;
        issues.push(`${file}: Q${q.id} keypoint[${i}] is not [x, y] array: ${JSON.stringify(kp)}`);
      }
    }
  }
}

console.log(`gp-graph-keypoints-arrays: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} keypoints are [number, number] arrays`);
