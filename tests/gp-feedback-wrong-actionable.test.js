// gp-feedback-wrong-actionable.test.js — feedback_wrong should guide Kai, not just say "wrong"
// Checks that feedback_wrong has 5+ words (not just "Incorrect." or "Wrong answer.")

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_WORDS = 5;

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fw = (q.feedback_wrong || '').trim();
    const wordCount = fw ? fw.split(/\s+/).length : 0;
    
    if (wordCount >= MIN_WORDS) {
      pass++;
    } else {
      warn++;
      issues.push(`${file}: Q${q.id} feedback_wrong only ${wordCount} words: "${fw}"`);
    }
  }
}

console.log(`gp-feedback-wrong-actionable: ${pass} pass, ${warn} too brief`);
if (issues.length) {
  console.log(`BRIEF FEEDBACK WARN — need ${MIN_WORDS}+ words to be actionable (GR domain):`);
  issues.slice(0, 6).forEach(i => console.log('  WARN:', i));
  if (issues.length > 6) console.log(`  ... and ${issues.length - 6} more`);
}
process.exit(0);
