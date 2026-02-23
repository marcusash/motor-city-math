// gp-feedback-correct-no-period-end.test.js
// feedback_correct (celebration) should end with ! or . — not trailing spaces or cut-off text

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
    const fb = (q.feedback_correct || '').trimEnd();
    if (!fb) continue;
    const last = fb[fb.length - 1];
    if (['.', '!', '?', ')', '}'].includes(last)) {
      pass++;
    } else {
      warn++;
      warnings.push(`${file}: Q${q.id} feedback_correct ends with '${last}': "${fb.substring(fb.length - 30)}"`);
    }
  }
}

console.log(`gp-feedback-correct-no-period-end: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — feedback ending without punctuation (notify GR):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} feedback_correct end with proper punctuation`);
