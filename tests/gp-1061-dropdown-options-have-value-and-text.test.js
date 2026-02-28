// gp-1061-dropdown-options-have-value-and-text.test.js
// Dropdown options must have value+text fields.
// Section A "identify" dropdowns use plain string options (not {value,text} objects). Those are skipped.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0, stringOpts = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'dropdown') continue;
      for (let i = 0; i < (inp.options || []).length; i++) {
        const opt = inp.options[i];
        if (typeof opt === 'string') { stringOpts++; continue; } // plain-string option (Section A identify type)
        if (typeof opt.value !== 'undefined' && typeof opt.text !== 'undefined') { pass++; }
        else { fail++; failures.push(`${file}: ${q.id}/${inp.id} option[${i}] missing value or text`); }
      }
    }
  }
}

console.log(`gp-1061-dropdown-options-have-value-and-text: ${pass} object-opts pass, ${stringOpts} string-opts, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all object-format dropdown options have value and text fields`);
