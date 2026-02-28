// gp-question-html-min-length.test.js — question_html must be at least 20 chars (not a stub)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_LEN = 20;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const len = (q.question_html || '').trim().length;
    if (len >= MIN_LEN) {
      pass++;
    } else {
      fail++;
      issues.push(`${file}: Q${q.id} question_html too short (${len} chars): "${q.question_html}"`);
    }
  }
}

console.log(`gp-question-html-min-length: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} questions have question_html of at least ${MIN_LEN} chars`);
