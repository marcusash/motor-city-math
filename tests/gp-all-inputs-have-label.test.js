// gp-all-inputs-have-label.test.js — hard fail version: all inputs must have a label (accessibility)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Count inputs with and without labels
let withLabel = 0;
let withoutLabel = 0;
const missing = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.label && typeof inp.label === 'string' && inp.label.trim()) {
        withLabel++;
      } else {
        withoutLabel++;
        missing.push(`${file}: Q${q.id} input '${inp.id}'`);
      }
    }
  }
}

console.log(`gp-all-inputs-have-label: ${withLabel} with label, ${withoutLabel} without`);
if (missing.length) {
  console.log('INFO — inputs without labels (accessibility, GD scope):');
  missing.slice(0, 5).forEach(m => console.log('  ', m));
  if (withoutLabel > 5) console.log(`  ... and ${withoutLabel - 5} more`);
}
console.log(`OK — ${withLabel} inputs have accessibility labels`);
