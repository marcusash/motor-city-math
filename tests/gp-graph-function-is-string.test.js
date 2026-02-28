// gp-graph-function-is-string.test.js — graph function must be a non-empty string

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
    if (typeof q.graph.function === 'string' && q.graph.function.trim().length > 0) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} graph.function is not a valid string`); }
  }
}

console.log(`gp-graph-function-is-string: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graph functions are non-empty strings`);
