// gp-no-inline-script-in-questions.test.js — question_html must not contain inline script tags (XSS risk)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const SCRIPT_RE = /<script/i;
let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const qh = q.question_html || '';
    const h = q.hint || '';
    if (SCRIPT_RE.test(qh) || SCRIPT_RE.test(h)) {
      fail++;
      failures.push(`${file}: Q${q.id} contains <script> tag in question_html or hint`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-inline-script-in-questions: ${pass} pass, ${fail} unsafe`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions are XSS-safe (no inline scripts)`);
