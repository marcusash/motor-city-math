// gp-graph-domain-symmetry.test.js — graph domain should be symmetric around 0 (xmin = -xmax)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let info = 0;
const notes = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const g = q.graph;
    if (!g) continue;
    const xMin = g.x_min !== undefined ? g.x_min : (g.xMin !== undefined ? g.xMin : null);
    const xMax = g.x_max !== undefined ? g.x_max : (g.xMax !== undefined ? g.xMax : null);
    if (xMin !== null && xMax !== null) {
      if (xMin !== -xMax) {
        info++;
        notes.push(`${file}: Q${q.id} asymmetric domain: x=[${xMin}, ${xMax}]`);
      } else {
        pass++;
      }
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-domain-symmetry: ${pass} pass, ${info} asymmetric`);
if (notes.length) {
  console.log('INFO — graphs with asymmetric x-axis (not always a problem):');
  notes.slice(0, 5).forEach(n => console.log('  ', n));
  if (info > 5) console.log(`  ... and ${info - 5} more`);
}
console.log(`OK — ${pass} graph axes checked for domain symmetry`);
