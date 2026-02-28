// gp-graph-keypoints-valid.test.js — graph questions must have valid keypoints structure

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
let skipped = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const graph = q.graph;
    if (!graph) {
      skipped++;
      continue;
    }
    
    const keypoints = graph.keypoints || graph.key_points || [];
    if (!Array.isArray(keypoints)) {
      fail++;
      issues.push(`${file}: Q${q.id} graph.keypoints is not an array`);
      continue;
    }
    
    let qOk = true;
    for (const kp of keypoints) {
      // Support both {x, y} object format and [x, y] array format
      const hasXY = Array.isArray(kp)
        ? (typeof kp[0] === 'number' && typeof kp[1] === 'number')
        : (typeof kp.x === 'number' && typeof kp.y === 'number');
      
      if (!hasXY) {
        fail++;
        issues.push(`${file}: Q${q.id} keypoint invalid format: ${JSON.stringify(kp)}`);
        qOk = false;
      }
    }
    if (qOk) pass++;
  }
}

console.log(`gp-graph-keypoints-valid: ${pass} pass, ${fail} fail, ${skipped} non-graph questions skipped`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} graph questions have valid keypoints`);
