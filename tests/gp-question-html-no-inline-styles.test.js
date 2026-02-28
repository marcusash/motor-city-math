// gp-question-html-no-inline-styles.test.js — inline styles in question_html are fragile; flag for review

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const INLINE_STYLE = /style\s*=/i;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = q.question_html || '';
    if (INLINE_STYLE.test(html)) {
      warn++;
      warnings.push(`${file}: Q${q.id} question_html has inline style attribute`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-html-no-inline-styles: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — inline styles in question HTML (GD review for design-system compliance):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} question_html fields use no inline styles`);
