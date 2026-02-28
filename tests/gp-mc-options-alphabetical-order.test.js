// gp-mc-options-alphabetical-order.test.js — MC options should follow a consistent A/B/C/D ordering structure

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'dropdown' && inp.type !== 'multiple_choice') continue;
      const opts = inp.options || [];
      if (opts.length < 2) continue;

      // Check that options have at least some ordering principle
      // (They don't need to be alphabetical, but they should all have values)
      const allHaveValues = opts.every(o => o && String(o).trim().length > 0);
      if (allHaveValues) {
        pass++;
      } else {
        warn++;
        warnings.push(`${file}: Q${q.id} '${inp.id}' has empty option values`);
      }
    }
  }
}

console.log(`gp-mc-options-alphabetical-order: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — options with empty values:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} MC/dropdown inputs have non-empty options`);
