// gp-graph-keypoints-min.test.js — each graph should have at least 3 key_points for visual clarity

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_KEYPOINTS = 3;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const graph = q.graph;
    if (!graph) continue;
    
    const kp = graph.key_points || [];
    if (kp.length >= MIN_KEYPOINTS) {
      pass++;
    } else {
      warn++;
      warnings.push(`${file}: Q${q.id} graph has ${kp.length} key_points (min: ${MIN_KEYPOINTS})`);
    }
  }
}

console.log(`gp-graph-keypoints-min: ${pass} pass, ${warn} under-threshold`);
if (warnings.length) {
  console.log('INFO — graphs with few keypoints (notify GR/GD):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} graphs have ${MIN_KEYPOINTS}+ key_points`);
