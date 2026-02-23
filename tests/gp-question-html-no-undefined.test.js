// gp-question-html-no-undefined.test.js — question_html should not contain 'undefined' as a string

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
    const html = q.question_html || '';
    if (html.includes('>undefined<') || html === 'undefined') {
      fail++;
      failures.push(`${file}: Q${q.id} question_html contains literal 'undefined'`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-html-no-undefined: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} questions are free of 'undefined' string`);
