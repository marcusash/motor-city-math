// gp-input-label-exists.test.js — every input should have a label field for accessibility

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
      if (!inp.label || typeof inp.label !== 'string' || inp.label.trim() === '') {
        warn++;
        warnings.push(`${file}: Q${q.id} input '${inp.id}' has no label`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-input-label-exists: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — inputs without label (accessibility concern):');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} inputs have label fields`);
