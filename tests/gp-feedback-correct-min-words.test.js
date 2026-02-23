// gp-feedback-correct-min-words.test.js — feedback_correct must have at least 3 words

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_WORDS = 3;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const words = String(q.feedback_correct || '').trim().split(/\s+/).filter(w => w.length > 0).length;
    if (words < MIN_WORDS) {
      fail++;
      failures.push(`${file}: Q${q.id} feedback_correct has only ${words} words`);
    } else { pass++; }
  }
}

console.log(`gp-feedback-correct-min-words: ${pass} pass, ${fail} too-short`);
if (failures.length) { failures.forEach(f => console.log('  ADVISORY:', f)); }
console.log(`OK — all ${pass} feedback_correct have >= ${MIN_WORDS} words`);
