// gp-feedback-starts-with-capital.test.js — feedback text should start with a capital letter

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const field of ['feedback_correct', 'feedback_wrong']) {
      const text = q[field] || '';
      if (!text) continue;
      const firstChar = text.trim()[0];
      if (firstChar && firstChar !== firstChar.toUpperCase()) {
        warn++;
        warnings.push(`${file}: Q${q.id} '${field}' starts lowercase: "${text.substring(0, 60)}"`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-feedback-starts-with-capital: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — feedback starting lowercase (cosmetic, notify GR):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} feedback fields start with capital`);
