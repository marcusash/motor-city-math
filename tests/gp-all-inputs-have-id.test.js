// gp-all-inputs-have-id.test.js — every input must have an id field (required for grading)

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
    for (const inp of (q.inputs || [])) {
      if (!inp.id || String(inp.id).trim() === '') {
        fail++;
        failures.push(`${file}: Q${q.id} has input missing id`);
      } else { pass++; }
    }
  }
}

console.log(`gp-all-inputs-have-id: ${pass} pass, ${fail} missing id`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} inputs have id fields`);
