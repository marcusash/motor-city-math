// gp-graph-function-present.test.js — graph questions must have a function field for rendering

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
    
    const func = q.graph.function;
    if (!func || !func.trim()) {
      fail++;
      issues.push(`${file}: Q${q.id} has graph but no function field`);
    } else {
      pass++;
      // Spot-check for obvious issues — function should have 'x' or be a constant
      if (!func.includes('x') && !func.includes('Math.')) {
        // Could be a constant function — log for review
        console.log(`  NOTE: ${file} Q${q.id} function has no x: '${func.substring(0, 40)}'`);
      }
    }
  }
}

console.log(`gp-graph-function-present: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} graph questions have function fields`);
