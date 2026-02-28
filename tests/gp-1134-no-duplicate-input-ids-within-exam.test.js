// gp-1134-no-duplicate-input-ids-within-exam.test.js
// Input IDs must be unique within each exam (no duplicate input IDs).

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
  const ids = data.questions.flatMap(q => q.inputs || []).map(i => i.id);
  const seen = new Set();
  const dups = [];
  for (const id of ids) { if (seen.has(id)) dups.push(id); else seen.add(id); }
  if (dups.length === 0) { pass++; }
  else { fail++; failures.push(`${file}: duplicate input IDs: ${dups.join(', ')}`); }
}

console.log(`gp-1134-no-duplicate-input-ids-within-exam: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} exams have unique input IDs`);
