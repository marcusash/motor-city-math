// gp-section-c-is-always-graph-type.test.js — Section C questions (Q12, Q13) must have type "graph" (with known exception: RP11-Q13)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Known documented exception: RP11-Q13 is "rational" type but still has graph field
const EXCEPTIONS = new Set(['rp11-q13']);

let pass = 0, fail = 0, exceptions = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.section !== 'C') continue;
    if (EXCEPTIONS.has(q.id)) { exceptions++; continue; }
    if (q.type === 'graph') { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} Section C has type "${q.type}" (expected "graph")`); }
  }
}

console.log(`gp-section-c-is-always-graph-type: ${pass} pass, ${fail} fail, ${exceptions} known exceptions`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} Section C questions have type "graph" (${exceptions} exception: rp11-q13 is rational)`);
