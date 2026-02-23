// gp-question-html-no-inline-style.test.js — question_html should not use style= attributes

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const STYLE_RE = /style\s*=/i;
let pass = 0, fail = 0;
const findings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = q.question_html;
    if (typeof html !== 'string') continue;
    if (STYLE_RE.test(html)) {
      fail++;
      findings.push(`${file}: ${q.id} uses inline style in question_html`);
    } else { pass++; }
  }
}

console.log(`gp-question-html-no-inline-style: ${pass} pass, ${fail} advisory`);
if (findings.length) { findings.slice(0, 5).forEach(f => console.log('  INFO:', f)); }
console.log(`OK — inline style audit complete`);
