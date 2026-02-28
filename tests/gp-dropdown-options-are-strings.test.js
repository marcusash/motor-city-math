// gp-dropdown-options-are-strings.test.js — dropdown options must all be strings (not numbers or null)

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
      const options = input.options || input.choices || [];
      for (const opt of options) {
        if (typeof opt !== 'string') {
          fail++;
          failures.push(`${file}: Q${q.id} dropdown "${input.id}" has non-string option: ${JSON.stringify(opt)}`);
        } else {
          pass++;
        }
      }
    }
  }
}

console.log(`gp-dropdown-options-are-strings: ${pass} pass, ${fail} non-string`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} dropdown options are strings`);
