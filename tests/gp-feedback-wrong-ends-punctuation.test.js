// gp-feedback-wrong-ends-punctuation.test.js — feedback_wrong should end with punctuation

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
    const fb = (q.feedback_wrong || '').trimEnd();
    if (!fb) continue;
    const last = fb[fb.length - 1];
    if (['.', '!', '?', ')', '}'].includes(last)) {
      pass++;
    } else {
      warn++;
      warnings.push(`${file}: Q${q.id} feedback_wrong ends with '${last}': "${fb.substring(Math.max(0, fb.length - 30))}"`);
    }
  }
}

console.log(`gp-feedback-wrong-ends-punctuation: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — feedback_wrong ending without punctuation (notify GR):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} feedback_wrong end with punctuation`);
