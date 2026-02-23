// gp-1051-graph-function-display-not-empty.test.js — function_display must be non-empty string

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const fd = q.graph.function_display;
    if (typeof fd === 'string' && fd.trim().length > 0) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} function_display="${fd}" is empty/missing`); }
  }
}

console.log(`gp-1051-graph-function-display-not-empty: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graph function_display values are non-empty`);
