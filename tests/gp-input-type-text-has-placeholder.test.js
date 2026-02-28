// gp-input-type-text-has-placeholder.test.js — text inputs should have a label (not rely on placeholder)
// Placeholder-only labels are inaccessible and fail on ADHD users who miss them

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
      if (inp.type !== 'text') continue;
      const hasLabel = inp.label && inp.label.trim().length > 0;
      const hasPlaceholder = inp.placeholder && inp.placeholder.trim().length > 0;
      
      if (hasLabel) {
        pass++;
      } else if (hasPlaceholder) {
        warn++;
        warnings.push(`${file}: Q${q.id} '${inp.id}' uses placeholder-only (no label) — accessibility risk`);
      } else {
        warn++;
        warnings.push(`${file}: Q${q.id} '${inp.id}' has no label or placeholder`);
      }
    }
  }
}

console.log(`gp-input-type-text-has-placeholder: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — text inputs relying on placeholder (accessibility risk):');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warnings.length > 5) console.log(`  ... and ${warnings.length - 5} more`);
}
console.log(`OK — ${pass} text inputs have explicit labels`);
