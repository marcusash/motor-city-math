// gp-no-html-comments-in-questions.test.js — <!-- HTML comments --> should not appear in question_html

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
    if (html.includes('<!--')) {
      warn++;
      warnings.push(`${file}: Q${q.id} question_html contains HTML comment`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-html-comments-in-questions: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — questions with HTML comments (GR should remove):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} questions have no HTML comments`);
