// gp-question-html-length.test.js — question_html should not be excessively long (ADHD: clear and focused)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_Q_HTML_LENGTH = 600; // chars — if longer, may need to be restructured
const MIN_Q_HTML_LENGTH = 15;  // sanity check

let pass = 0;
let tooLong = 0;
let tooShort = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = (q.question_html || '').trim();
    if (html.length < MIN_Q_HTML_LENGTH) {
      tooShort++;
      issues.push(`SHORT: ${file} Q${q.id} question_html only ${html.length} chars`);
    } else if (html.length > MAX_Q_HTML_LENGTH) {
      tooLong++;
      issues.push(`LONG: ${file} Q${q.id} question_html is ${html.length} chars (>${MAX_Q_HTML_LENGTH}): "${html.substring(0,60)}..."`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-html-length: ${pass} pass, ${tooLong} too long, ${tooShort} too short (informational)`);
if (issues.length) {
  issues.slice(0, 10).forEach(i => console.log('  ', i));
  if (issues.length > 10) console.log(`  ...and ${issues.length - 10} more`);
}
process.exit(0);
