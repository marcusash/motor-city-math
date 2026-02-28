// gp-graph-has-function-field.test.js — every graph object must have a function field

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
    if (typeof q.graph.function !== 'string' || q.graph.function.trim().length === 0) {
      fail++;
      failures.push(`${file}: ${q.id} graph missing function field`);
    } else { pass++; }
  }
}

console.log(`gp-graph-has-function-field: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graphs have a function field`);
