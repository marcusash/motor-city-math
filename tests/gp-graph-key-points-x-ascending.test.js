// gp-graph-key-points-x-ascending.test.js — keypoints x-values should be in ascending order for graph rendering

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
    const kps = q.graph.key_points || [];
    if (kps.length < 2) { pass++; continue; }
    let isAscending = true;
    for (let i = 1; i < kps.length; i++) {
      if (kps[i][0] <= kps[i-1][0]) {
        isAscending = false;
        break;
      }
    }
    if (isAscending) {
      pass++;
    } else {
      warn++;
      warnings.push(`${file}: Q${q.id} keypoints x-values are not ascending: ${JSON.stringify(kps.map(p => p[0]))}`);
    }
  }
}

console.log(`gp-graph-key-points-x-ascending: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — keypoints not in ascending x-order (graph rendering may be affected):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} graphs have keypoints in ascending x-order`);
