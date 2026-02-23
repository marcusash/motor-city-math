// gp-feedback-not-too-long.test.js — neither feedback field should exceed 20 words

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_WORDS = 20;
let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const [field, label] of [['feedback_correct', 'correct'], ['feedback_wrong', 'wrong']]) {
      const text = (q[field] || '').trim();
      if (!text) { pass++; continue; }
      const words = text.split(/\s+/).length;
      if (words > MAX_WORDS) {
        warn++;
        warnings.push(`${file}: Q${q.id} feedback_${label} is ${words} words: "${text.substring(0, 60)}"`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-feedback-not-too-long: ${pass} pass, ${warn} over ${MAX_WORDS} words`);
if (warnings.length) {
  console.log('INFO — feedback exceeding 20 words (ADHD risk):');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} feedback fields within ${MAX_WORDS}-word limit`);
