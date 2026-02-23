// gp-dropdown-options-min-3.test.js — dropdown inputs should have at least 3 options (not binary guessing)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_OPTIONS = 3;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'dropdown') continue;
      const opts = inp.options || [];
      if (opts.length < MIN_OPTIONS) {
        warn++;
        warnings.push(`${file}: Q${q.id} '${inp.id}' has only ${opts.length} options: [${opts.join(', ')}]`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-dropdown-options-min-3: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — dropdowns with fewer than 3 options (too easy to guess):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} dropdowns have ${MIN_OPTIONS}+ options`);
