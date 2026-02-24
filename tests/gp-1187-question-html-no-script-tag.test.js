// gp-1187-question-html-no-script-tag.test.js
// question_html must not contain script tags (security + trust).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = q.question_html || '';
    if (/<script/i.test(html)) { fail++; failures.push(file + ': ' + q.id + ' question_html has <script>'); }
    else pass++;
  }
}
console.log('gp-1187-question-html-no-script-tag: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no script tags in question_html');
