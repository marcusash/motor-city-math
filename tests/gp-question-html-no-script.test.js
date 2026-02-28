// gp-question-html-no-script.test.js — question_html must not contain <script> tags (XSS risk)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const SCRIPT_RE = /<script[\s>]/i;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = q.question_html || '';
    if (SCRIPT_RE.test(html)) {
      fail++;
      issues.push(`${file}: Q${q.id} question_html contains <script> tag`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-html-no-script: ${pass} pass, ${fail} violations`);
if (issues.length) {
  console.log('SECURITY VIOLATIONS — remove <script> from question_html:');
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} question_html fields are script-free`);
