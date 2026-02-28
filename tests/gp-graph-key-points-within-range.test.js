// gp-graph-key-points-within-range.test.js — graph key_points must be within x_range and y_range

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
    const xr = q.graph.x_range;
    const yr = q.graph.y_range;
    if (!kp || !Array.isArray(kp)) continue;
    
    for (const pt of kp) {
      if (!Array.isArray(pt) || pt.length !== 2) continue;
      const [x, y] = pt;
      if (xr && (x < xr[0] || x > xr[1])) {
        warn++;
        warnings.push(`${file}: Q${q.id} key_point [${x},${y}] x=${x} outside x_range=[${xr}]`);
      } else if (yr && (y < yr[0] || y > yr[1])) {
        warn++;
        warnings.push(`${file}: Q${q.id} key_point [${x},${y}] y=${y} outside y_range=[${yr}]`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-graph-key-points-within-range: ${pass} pass, ${warn} out-of-range`);
if (warnings.length) {
  console.log('INFO — key points outside graph bounds:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} key points are within graph range`);
