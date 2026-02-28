// gp-1113-graph-type-field-is-string.test.js
// graph type field (q.type) for C-section questions must be a string.

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
    if (typeof q.type === 'string' && q.type.length > 0) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} type="${q.type}" is not a non-empty string`); }
  }
}

console.log(`gp-1113-graph-type-field-is-string: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} Section C question types are valid strings`);
