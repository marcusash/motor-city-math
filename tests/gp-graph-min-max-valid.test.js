// gp-graph-min-max-valid.test.js — graph x_min, x_max, y_min, y_max should be numeric and in order

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
    const g = q.graph;
    if (!g) continue;
    
    const { x_min, x_max, y_min, y_max } = g;
    
    // If bounds aren't present, skip (graphs may use auto-range)
    if (x_min === undefined && x_max === undefined && y_min === undefined && y_max === undefined) {
      continue;
    }
    
    // All present must be numbers
    if ([x_min, x_max, y_min, y_max].some(v => typeof v !== 'number' || isNaN(v))) {
      fail++;
      issues.push(`${file}: Q${q.id} graph has non-numeric bounds: x[${x_min},${x_max}] y[${y_min},${y_max}]`);
      continue;
    }
    
    // min must be less than max
    if (x_min >= x_max) {
      fail++;
      issues.push(`${file}: Q${q.id} graph x_min(${x_min}) >= x_max(${x_max})`);
    } else if (y_min >= y_max) {
      fail++;
      issues.push(`${file}: Q${q.id} graph y_min(${y_min}) >= y_max(${y_max})`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-min-max-valid: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} graphs have valid x/y bounds`);
