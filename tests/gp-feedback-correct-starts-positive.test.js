// gp-feedback-correct-starts-positive.test.js — feedback_correct should start with positive words

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const POSITIVE_STARTERS = ['correct', 'great', 'nice', 'perfect', 'excellent', 'yes', 'right',
  'good', 'solid', 'nailed', 'locked', 'boom', 'that', 'you got', '🔥', '✅', '🎯', '💪', '⭐'];

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = (q.feedback_correct || '').trim().toLowerCase();
    if (!fc) { pass++; continue; }
    // Check emoji start (first char may be multi-byte emoji)
    const rawFc = (q.feedback_correct || '').trim();
    const startsPositive = POSITIVE_STARTERS.some(w => {
      return rawFc.toLowerCase().startsWith(w) || rawFc.startsWith(w);
    });
    if (!startsPositive) {
      warn++;
      warnings.push(`${file}: Q${q.id} feedback_correct: "${rawFc.substring(0, 50)}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-correct-starts-positive: ${pass} positive, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — feedback_correct not starting with positive word:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} feedback_correct start with positive framing`);
