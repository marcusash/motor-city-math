// gp-dropdown-inputs-have-options.test.js — dropdown inputs must have an options array

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
      if (inp.type !== 'dropdown') continue;
      const opts = inp.options || inp.choices;
      if (!opts || !Array.isArray(opts) || opts.length < 2) {
        fail++;
        failures.push(`${file}: Q${q.id} input '${inp.id}' is dropdown but has ${opts ? opts.length : 0} options`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-dropdown-inputs-have-options: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.slice(0, 5).forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} dropdown inputs have 2+ options`);
