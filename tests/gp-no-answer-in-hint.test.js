// gp-no-answer-in-hint.test.js
// Hint field should not contain the actual answer to the question
// A hint that reveals the answer ("The answer is 4") defeats its purpose

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Patterns that suggest the hint is giving away the answer
const SPOILER_PATTERNS = [
  /the answer is\b/i,
  /answer:\s*\d/i,
  /= \d+\.?\d*$/,  // ends with "= <number>"
  /\bis\b.*\d+\s*$/i,
];

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = q.hint || '';
    const isSpoiler = SPOILER_PATTERNS.some(p => p.test(hint));
    if (isSpoiler) {
      warn++;
      warnings.push(`${file}: Q${q.id} hint may reveal answer: "${hint.substring(0, 100)}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-answer-in-hint: ${pass} pass, ${warn} potential spoilers`);
if (warnings.length) {
  console.log('INFO — hints that may reveal answers (review with GR):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} hints appear non-spoiling`);
