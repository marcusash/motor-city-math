// gp-dropdown-options-min.test.js — dropdown inputs should have at least 2 options

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_OPTIONS = 2;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'dropdown') continue;
      const opts = inp.options || [];
      if (opts.length >= MIN_OPTIONS) {
        pass++;
      } else {
        fail++;
        issues.push(`${file}: Q${q.id} '${inp.id}' dropdown has ${opts.length} options (min: ${MIN_OPTIONS})`);
      }
    }
  }
}

console.log(`gp-dropdown-options-min: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} dropdowns have ${MIN_OPTIONS}+ options`);
