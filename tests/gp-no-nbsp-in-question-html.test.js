// gp-no-nbsp-in-question-html.test.js — &nbsp; in question_html can cause rendering issues in MathJax

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
    const html = q.question_html || '';
    if (html.includes('\u00a0') || html.includes('&nbsp;')) {
      warn++;
      warnings.push(`${file}: Q${q.id} question_html contains non-breaking space`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-nbsp-in-question-html: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — non-breaking spaces in question HTML (may interfere with MathJax):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} question_html fields free of non-breaking spaces`);
