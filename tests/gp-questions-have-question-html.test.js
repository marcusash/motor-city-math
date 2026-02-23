// gp-questions-have-question-html.test.js — every question must have a non-empty question_html

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
    if (typeof q.question_html !== 'string' || q.question_html.trim().length === 0) {
      fail++;
      failures.push(`${file}: ${q.id} missing or empty question_html`);
    } else { pass++; }
  }
}

console.log(`gp-questions-have-question-html: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have non-empty question_html`);
