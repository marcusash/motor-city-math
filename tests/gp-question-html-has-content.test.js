// gp-question-html-has-content.test.js — question_html should have meaningful content (>10 chars)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_LENGTH = 10;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = q.question_html || '';
    // Strip HTML tags and count text content
    const textContent = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    
    if (textContent.length < MIN_LENGTH) {
      fail++;
      issues.push(`${file}: Q${q.id} question_html has only ${textContent.length} visible chars: "${textContent}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-html-has-content: ${pass} pass, ${fail} too short`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} question_html fields have sufficient content`);
