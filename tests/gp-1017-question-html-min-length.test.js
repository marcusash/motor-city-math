// gp-1017-question-html-min-length.test.js — every question_html should be at least 10 chars

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN = 10;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const len = (q.question_html || '').length;
    if (len >= MIN) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} question_html is only ${len} chars`); }
  }
}

console.log(`gp-1017-question-html-min-length: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have question_html >= ${MIN} chars`);
