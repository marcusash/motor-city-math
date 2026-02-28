// gp-input-type-is-valid.test.js — all input types must be from the known set

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VALID_TYPES = new Set(['number', 'text', 'dropdown', 'radio']);
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (!VALID_TYPES.has(inp.type)) {
        fail++;
        failures.push(`${file}: Q${q.id} input#${inp.id} has unknown type="${inp.type}"`);
      } else { pass++; }
    }
  }
}

console.log(`gp-input-type-is-valid: ${pass} pass, ${fail} invalid`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} inputs have valid type (number/text/dropdown/radio)`);
