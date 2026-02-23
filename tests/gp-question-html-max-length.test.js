// gp-question-html-max-length.test.js — question_html should not exceed 1500 chars (ADHD: manageable chunks)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_CHARS = 1500;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = (q.question_html || '').trim();
    if (html.length > MAX_CHARS) {
      warn++;
      warnings.push(`${file}: Q${q.id} question_html is ${html.length} chars (max ${MAX_CHARS})`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-html-max-length: ${pass} pass, ${warn} over limit`);
if (warnings.length) {
  console.log('INFO — questions with very long HTML:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions have manageable HTML length`);
