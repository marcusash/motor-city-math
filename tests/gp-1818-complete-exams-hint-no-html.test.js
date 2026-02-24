// gp-1818-complete-exams-hint-no-html.test.js
// Hints should not contain raw HTML tags.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.hint) continue;
    if (/<[a-z]+[^>]*>/i.test(q.hint)) { fail++; failures.push(data.exam_id + ':' + q.id + ' has HTML in hint'); }
    else pass++;
  }
}
console.log('gp-1818-hint-no-html: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no HTML tags in hints (' + pass + ' questions)');
