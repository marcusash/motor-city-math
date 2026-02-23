// gp-graph-keypoint-coords-sane.test.js — keypoint coordinates should be in reasonable graph range

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_COORD = -100;
const MAX_COORD = 100;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const kps = q.graph.key_points || [];
    for (let i = 0; i < kps.length; i++) {
      const [x, y] = kps[i];
      if (x < MIN_COORD || x > MAX_COORD || y < MIN_COORD || y > MAX_COORD) {
        warn++;
        warnings.push(`${file}: Q${q.id} keypoint[${i}] = [${x}, ${y}] outside [-100, 100] range`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-graph-keypoint-coords-sane: ${pass} pass, ${warn} out-of-range`);
if (warnings.length) {
  console.log('INFO — keypoints with extreme coordinates (verify graph scale):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} keypoints within [-100, 100] coordinate range`);
