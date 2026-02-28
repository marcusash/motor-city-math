// gp-1039-section-c-always-has-graph.test.js — Section C questions (Q12/Q13) must have graph field

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
  for (const q of data.questions.filter(q => q.section === 'C')) {
    if (q.graph && typeof q.graph === 'object') { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} Section C question missing graph field`); }
  }
}

console.log(`gp-1039-section-c-always-has-graph: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} Section C questions have graph field`);
