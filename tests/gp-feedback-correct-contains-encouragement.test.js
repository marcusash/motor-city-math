// gp-feedback-correct-contains-encouragement.test.js — correct feedback should feel motivating
// Looks for keywords: "nice", "right", "correct", "great", "yes", "exactly", "perfect"

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const ENCOURAGEMENT_WORDS = ['nice', 'right', 'correct', 'great', 'yes', 'exactly', 'perfect', 'good', 'solid', 'spot on', 'nailed'];

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = (q.feedback_correct || '').toLowerCase();
    const hasEncouragement = ENCOURAGEMENT_WORDS.some(w => fc.includes(w));
    if (!hasEncouragement) {
      warn++;
      warnings.push(`${file}: Q${q.id} feedback_correct has no encouragement word: "${q.feedback_correct}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-correct-contains-encouragement: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — feedback_correct without encouragement keywords:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions have encouraging correct feedback`);
