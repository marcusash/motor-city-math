// gp-no-repeated-words-feedback.test.js
// Feedback should not repeat the same word 3+ times in a row (likely copy-paste error)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const field of ['feedback_correct', 'feedback_wrong']) {
      const text = q[field] || '';
      const words = text.split(/\s+/);
      let hasRepeat = false;
      for (let i = 2; i < words.length; i++) {
        if (words[i] === words[i-1] && words[i] === words[i-2] && words[i].length > 2) {
          hasRepeat = true;
          issues.push(`${file}: Q${q.id} '${field}' has 3x repeated word '${words[i]}'`);
          break;
        }
      }
      if (!hasRepeat) pass++;
      else fail++;
    }
  }
}

console.log(`gp-no-repeated-words-feedback: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} feedback fields have no 3x word repetition`);
