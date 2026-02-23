// gp-dropdown-options-array.test.js — dropdown inputs must have an 'options' array with at least 2 entries

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
    for (const input of (q.inputs || [])) {
      if (input.type !== 'dropdown') continue;
      const opts = input.options || input.choices || [];
      if (!Array.isArray(opts) || opts.length < 2) {
        fail++;
        failures.push(`${file}: Q${q.id} dropdown id=${input.id} has ${opts.length} options (need ≥2)`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-dropdown-options-array: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.slice(0, 5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} dropdown inputs have ≥2 options`);
