// gp-question-html-no-broken-img.test.js — img tags without src or with empty src are broken

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BROKEN_IMG = /<img(?![^>]*src\s*=\s*['"][^'"]+['"])[^>]*>/gi;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = q.question_html || '';
    if (/<img/i.test(html)) {
      const match = html.match(BROKEN_IMG);
      if (match) {
        fail++;
        issues.push(`${file}: Q${q.id} has img tag without valid src`);
      } else {
        pass++;
      }
    } else {
      pass++; // no img tags = pass
    }
  }
}

console.log(`gp-question-html-no-broken-img: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} questions have no broken img tags`);
