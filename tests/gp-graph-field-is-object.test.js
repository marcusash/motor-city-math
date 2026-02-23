// gp-graph-field-is-object.test.js — graph field must be an object (not array/string) when present

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
    if (typeof q.graph !== 'object' || Array.isArray(q.graph)) {
      fail++;
      failures.push(`${file}: Q${q.id} graph is ${Array.isArray(q.graph) ? 'array' : typeof q.graph} (expected object)`);
    } else { pass++; }
  }
}

console.log(`gp-graph-field-is-object: ${pass} pass, ${fail} wrong type`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graph fields are objects`);
