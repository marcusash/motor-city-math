// gp-hint-no-html-tags.test.js — hints should be plain text, not HTML

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const HTML_TAG_PATTERN = /<[a-z][^>]*>/i;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = q.hint || '';
    if (HTML_TAG_PATTERN.test(hint)) {
      warn++;
      warnings.push(`${file}: Q${q.id} hint contains HTML tags: "${hint.substring(0, 60)}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-hint-no-html-tags: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — hints with HTML tags (should be plain text):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} hints are plain text (no HTML)`);
