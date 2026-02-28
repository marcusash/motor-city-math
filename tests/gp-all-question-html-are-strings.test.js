// gp-all-question-html-are-strings.test.js — question_html must be a string in every question

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
    if (typeof q.question_html !== 'string') {
      fail++;
      failures.push(`${file}: Q${q.id} question_html is ${typeof q.question_html}`);
    } else { pass++; }
  }
}

console.log(`gp-all-question-html-are-strings: ${pass} pass, ${fail} wrong type`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} question_html fields are strings`);
