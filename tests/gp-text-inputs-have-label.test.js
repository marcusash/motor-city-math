// gp-text-inputs-have-label.test.js — text-type inputs should have a label for accessibility

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
    for (const input of (q.inputs || [])) {
      if (input.type !== 'text') continue;
      const label = (input.label || '').trim();
      if (!label) {
        warn++;
        warnings.push(`${file}: Q${q.id} text input id=${input.id} missing label`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-text-inputs-have-label: ${pass} pass, ${warn} missing label`);
if (warnings.length) {
  console.log('INFO — text inputs without labels:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} text inputs have labels`);
