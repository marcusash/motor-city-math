// gp-1121-no-empty-question-html.test.js
// question_html must not be empty or whitespace-only in any question.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = (q.question_html || '').trim();
    if (html.length > 0) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} has empty question_html`); }
  }
}

console.log(`gp-1121-no-empty-question-html: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} questions have non-empty question_html`);
