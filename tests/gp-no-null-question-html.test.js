// gp-no-null-question-html.test.js — question_html must not be null or empty

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = q.question_html;
    if (html === null || html === undefined || String(html).trim() === '') {
      fail++;
      failures.push(`${file}: Q${q.id} question_html is null/empty`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-null-question-html: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have non-null question_html`);
