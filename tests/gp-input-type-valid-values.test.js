// gp-input-type-valid-values.test.js — input type must be one of the known valid types

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VALID_INPUT_TYPES = new Set(['text', 'number', 'select', 'radio', 'checkbox', 'textarea', 'dropdown']);

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      const t = inp.type;
      if (!t || !VALID_INPUT_TYPES.has(t)) {
        fail++;
        failures.push(`${file}: Q${q.id} input '${inp.id}' type='${t}' is not a valid input type`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-input-type-valid-values: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.slice(0, 5).forEach(f => console.log('  FAIL:', f));
  if (fail > 5) console.log(`  ... and ${fail - 5} more`);
  process.exit(1);
}
console.log(`OK — all ${pass} inputs have valid type values`);
