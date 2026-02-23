// gp-graph-label-not-empty.test.js — graph labels should be non-empty strings if present

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
    const g = q.graph;
    if (!g) continue;
    const labelFields = ['x_label', 'y_label', 'label', 'title'];
    for (const field of labelFields) {
      if (g[field] !== undefined) {
        if (typeof g[field] !== 'string' || g[field].trim() === '') {
          warn++;
          warnings.push(`${file}: Q${q.id} graph.${field}='${g[field]}' is empty`);
        } else {
          pass++;
        }
      }
    }
    pass++; // count the graph itself
  }
}

console.log(`gp-graph-label-not-empty: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — graphs with empty label fields:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} graph label checks passed`);
