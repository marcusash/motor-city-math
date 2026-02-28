// gp-1040-section-a-b-d-no-graph.test.js — Sections A, B, D must not have graph field

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
  for (const q of data.questions.filter(q => ['A','B','D'].includes(q.section))) {
    if (!q.graph) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} Section ${q.section} unexpectedly has graph field`); }
  }
}

console.log(`gp-1040-section-a-b-d-no-graph: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} Section A/B/D questions have no graph field`);
