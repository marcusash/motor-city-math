// gp-question-html-is-string.test.js — question_html must be a non-empty string

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
    const qh = q.question_html;
    if (typeof qh !== 'string' || qh.trim() === '') {
      fail++;
      failures.push(`${file}: Q${q.id} question_html=${JSON.stringify(qh).substring(0, 40)}`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-html-is-string: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have non-empty question_html strings`);
