// gp-input-type-valid.test.js — input type must be one of: dropdown, number, radio, text

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VALID_INPUT_TYPES = new Set(['dropdown', 'number', 'radio', 'text']);

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (!inp.type || !VALID_INPUT_TYPES.has(inp.type)) {
        fail++;
        failures.push(`${file}: Q${q.id} input '${inp.id}' has invalid type='${inp.type}'`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-input-type-valid: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.slice(0, 5).forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} inputs have valid type`);
