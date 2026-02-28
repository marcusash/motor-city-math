// gp-radio-options-valid.test.js — radio inputs must have at least 2 options

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
let skip = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'radio') { skip++; continue; }
      
      const options = inp.options || [];
      if (options.length < 2) {
        fail++;
        issues.push(`${file}: Q${q.id} '${inp.id}' radio has ${options.length} option(s) — need at least 2`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-radio-options-valid: ${pass} pass, ${fail} fail, ${skip} non-radio skipped`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} radio inputs have at least 2 options`);
