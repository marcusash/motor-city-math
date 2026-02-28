// gp-mc-options-min-count.test.js — multiple choice questions need at least 3 options

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
    if (q.type !== 'multiple-choice') continue;
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'select' && inp.type !== 'radio') continue;
      const optCount = (inp.options || []).length;
      if (optCount < MIN_OPTIONS) {
        fail++;
        failures.push(`${file}: Q${q.id} MC input has only ${optCount} options (min ${MIN_OPTIONS})`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-mc-options-min-count: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all MC inputs have at least ${MIN_OPTIONS} options`);
