// gp-dropdown-options-have-values.test.js — every dropdown option must have a value field

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
      if (inp.type !== 'dropdown') continue;
      const opts = inp.options || inp.choices || [];
      for (let i = 0; i < opts.length; i++) {
        const opt = opts[i];
        if (typeof opt === 'string' || (opt && (opt.value !== undefined || opt.text !== undefined))) { pass++; }
        else { fail++; failures.push(`${file}: ${q.id}/${inp.id} option[${i}] missing value`); }
      }
    }
  }
}

console.log(`gp-dropdown-options-have-values: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} dropdown options have values`);
