// gp-1981-complete-exams-hints-no-html.test.js
// Hints must not contain HTML tags.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const HTML_PATTERN = /<[^>]+>/;
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) for (const h of (q.hints||[])) {
    if (!HTML_PATTERN.test(h)) pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+' hint has HTML: '+h.slice(0,40)); }
  }
}
console.log('gp-1981-hints-no-html: ' + pass + ' clean, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no HTML in any hints (' + pass + ' checked)');
