// gp-1066-identify-type-uses-string-options.test.js
// Identify-type questions use q_parent dropdowns with plain string options.
// This locks the pattern: string options = identify type, {value,text} objects = radio/other.

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
    if (q.type !== 'identify') continue;
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'dropdown') continue;
      const allStrings = (inp.options || []).every(o => typeof o === 'string');
      if (allStrings) { pass++; }
      else { fail++; failures.push(`${file}: ${q.id}/${inp.id} identify dropdown has non-string options`); }
    }
  }
}

console.log(`gp-1066-identify-type-uses-string-options: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} identify-type dropdowns use plain string options`);
