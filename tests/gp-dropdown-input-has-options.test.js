// gp-dropdown-input-has-options.test.js — every dropdown input must have an options or choices array

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
      const opts = inp.options || inp.choices;
      if (Array.isArray(opts) && opts.length > 0) { pass++; }
      else { fail++; failures.push(`${file}: ${q.id}/${inp.id} dropdown has no options/choices`); }
    }
  }
}

console.log(`gp-dropdown-input-has-options: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} dropdown inputs have options`);
