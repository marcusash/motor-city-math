// gp-question-html-nonempty.test.js — verify question_html field is not empty (content is present)

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
    const html = (q.question_html || '').trim();
    if (html.length >= 10) {
      // 10 chars minimum — enough to be a real question
      pass++;
    } else {
      fail++;
      issues.push(`${file}: Q${q.id} question_html is too short or empty: '${html}'`);
    }
  }
}

// Rename output to match new filename
console.log(`gp-question-html-nonempty: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(fail > 0 ? 1 : 0);
}
console.log(`OK — all ${pass} question_html fields have content`);

