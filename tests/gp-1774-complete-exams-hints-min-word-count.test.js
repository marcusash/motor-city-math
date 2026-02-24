// gp-1774-complete-exams-hints-min-word-count.test.js
// Every hint must have at least 3 words (quality guard).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.hint) continue;
    const words = q.hint.trim().split(/\s+/).length;
    if (words >= 3) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' hint words=' + words + ': ' + q.hint); }
  }
}
console.log('gp-1774-hints-min-words: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all hints have >= 3 words (' + pass + ' hints)');
