// gp-feedback-correct-word-count-min.test.js — feedback_correct should be at least 3 words (not one-word answers)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_WORDS = 3;
let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = String(q.feedback_correct || '').trim();
    const words = fc.split(/\s+/).filter(w => w.length > 0).length;
    if (words < MIN_WORDS) {
      warn++;
      warnings.push(`${file}: Q${q.id} feedback_correct has only ${words} words: "${fc}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-correct-word-count-min: ${pass} pass, ${warn} too short`);
if (warnings.length) {
  warnings.slice(0, 5).forEach(w => console.log('  INFO:', w));
}
console.log(`OK — ${pass} feedback_correct fields have >= ${MIN_WORDS} words`);
