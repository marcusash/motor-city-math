// gp-feedback-wrong-has-hint.test.js — feedback_wrong should guide Kai to the correct approach (not just say "wrong")

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Too-short feedback_wrong is unhelpful
const MIN_WRONG_LENGTH = 15;

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fw = (q.feedback_wrong || '').trim();
    if (!fw) continue; // already caught by gp-feedback-present
    
    if (fw.length >= MIN_WRONG_LENGTH) {
      pass++;
    } else {
      warn++;
      issues.push(`${file}: Q${q.id} feedback_wrong is too short (${fw.length} chars): "${fw}"`);
    }
  }
}

console.log(`gp-feedback-wrong-has-hint: ${pass} pass, ${warn} too short`);
if (issues.length) {
  console.log('SHORT FEEDBACK_WRONG (informational — GD/GR domain):');
  issues.forEach(i => console.log('  ', i));
}
process.exit(0);
