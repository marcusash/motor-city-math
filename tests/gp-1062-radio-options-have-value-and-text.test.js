// gp-1062-radio-options-have-value-and-text.test.js — radio options must have value and text fields

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
      if (inp.type !== 'radio') continue;
      for (let i = 0; i < (inp.options || []).length; i++) {
        const opt = inp.options[i];
        if (typeof opt.value !== 'undefined' && typeof opt.text !== 'undefined') { pass++; }
        else { fail++; failures.push(`${file}: ${q.id}/${inp.id} option[${i}] missing value or text`); }
      }
    }
  }
}

console.log(`gp-1062-radio-options-have-value-and-text: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} radio options have value and text fields`);
