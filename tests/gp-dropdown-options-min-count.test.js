// gp-dropdown-options-min-count.test.js — dropdown inputs should have at least 3 options

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_OPTIONS = 3;

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'dropdown') continue;
      const opts = inp.options || [];
      if (opts.length < MIN_OPTIONS) {
        fail++;
        failures.push(`${file}: Q${q.id} dropdown '${inp.id}' has only ${opts.length} options`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-dropdown-options-min-count: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} dropdown inputs have at least ${MIN_OPTIONS} options`);
