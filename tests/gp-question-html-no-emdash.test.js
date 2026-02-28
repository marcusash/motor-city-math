// gp-question-html-no-emdash.test.js — question_html must not contain em dashes

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EMDASH_RE = /[—–]/;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = q.question_html || '';
    if (EMDASH_RE.test(html)) {
      fail++;
      issues.push(`${file}: Q${q.id} question_html: "${html.replace(/[—–]/, '>>>EM-DASH<<<').substring(0, 80)}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-html-no-emdash: ${pass} pass, ${fail} violations`);
if (issues.length) {
  console.log('EM DASH VIOLATIONS in question_html (must fix):');
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} question_html fields are em-dash free`);
