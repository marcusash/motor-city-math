// gp-inputs-have-id-field.test.js — every input must have an id field for grading

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (!inp.id || String(inp.id).trim() === '') {
        fail++;
        failures.push(`${file}: Q${q.id} has an input with no id field`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-inputs-have-id-field: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.slice(0, 5).forEach(f => console.log('  FAIL:', f));
  if (fail > 5) console.log(`  ... and ${fail - 5} more`);
  process.exit(1);
}
console.log(`OK — all ${pass} inputs have an id field`);
