// gp-question-html-no-script-injection.test.js — no <script>, eval(), or javascript: in question_html

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const INJECTION_PATTERNS = [
  /<script/i,
  /\beval\(/i,
  /javascript:/i,
  /on(click|load|error|mouseover)=/i
];

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = q.question_html || '';
    const found = INJECTION_PATTERNS.find(p => p.test(html));
    if (found) {
      fail++;
      failures.push(`${file}: Q${q.id} question_html contains injection pattern: ${found}`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-html-no-script-injection: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} questions are free of script injection patterns`);
