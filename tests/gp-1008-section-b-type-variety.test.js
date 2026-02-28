// gp-1008-section-b-type-variety.test.js — Section B must have at least 3 different question types per exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_TYPES = 3;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const types = new Set(data.questions.filter(q => q.section === 'B').map(q => q.type));
  if (types.size >= MIN_TYPES) { pass++; }
  else { fail++; failures.push(`${file}: Section B has only ${types.size} types: ${[...types].join(', ')}`); }
}

console.log(`gp-1008-section-b-type-variety: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have 3+ types in Section B`);
