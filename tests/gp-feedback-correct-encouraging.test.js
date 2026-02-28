// gp-feedback-correct-encouraging.test.js — feedback_correct should contain at least one positive marker
// Checks for emojis (🔥✅🏆) or positive words (great, correct, nailed, perfect, yes)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Positive markers per .voice-guide.md
const POSITIVE_RE = /[🔥✅🏆🎯💪⭐]|correct|right|nailed|perfect|great|yes!|exactly|got it|nice/i;

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = q.feedback_correct || '';
    if (!fc.trim()) {
      warn++;
      issues.push(`${file}: Q${q.id} feedback_correct is empty`);
    } else if (POSITIVE_RE.test(fc)) {
      pass++;
    } else {
      warn++;
      issues.push(`${file}: Q${q.id} feedback_correct lacks positive marker: "${fc.substring(0, 60)}"`);
    }
  }
}

console.log(`gp-feedback-correct-encouraging: ${pass} pass, ${warn} lacking positive markers`);
if (issues.length) {
  console.log('VOICE GUIDE GAPS — add emoji or positive word to feedback_correct (GR/GD domain):');
  issues.slice(0, 8).forEach(i => console.log('  WARN:', i));
  if (issues.length > 8) console.log(`  ... and ${issues.length - 8} more`);
}
process.exit(0);
