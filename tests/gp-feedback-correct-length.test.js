// gp-feedback-correct-length.test.js
// feedback_correct should be between 10 and 120 chars — not too terse, not too long for ADHD

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_LEN = 10;
const MAX_LEN = 120;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fb = q.feedback_correct || '';
    const len = fb.length;
    if (len < MIN_LEN) {
      warn++;
      warnings.push(`${file}: Q${q.id} feedback_correct too short (${len} chars): "${fb}"`);
    } else if (len > MAX_LEN) {
      warn++;
      warnings.push(`${file}: Q${q.id} feedback_correct too long (${len} chars): "${fb.substring(0, 80)}..."`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-correct-length: ${pass} pass, ${warn} out-of-range`);
if (warnings.length) {
  console.log('INFO — length issues (informational, notify GR for content fixes):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} feedback_correct within 10-120 chars, ${warn} flagged`);
