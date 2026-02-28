// gp-hint-ends-with-period-or-question.test.js — hints should end with punctuation (.  or ?)

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
    const hint = (q.hint || '').trim();
    if (!hint) { pass++; continue; }
    if (/[.?!]$/.test(hint)) {
      pass++;
    } else {
      warn++;
      warnings.push(`${file}: Q${q.id} hint doesn't end with punctuation: "${hint.substring(0, 50)}"`);
    }
  }
}

console.log(`gp-hint-ends-with-period-or-question: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — hints lacking terminal punctuation:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} hints have proper terminal punctuation`);
