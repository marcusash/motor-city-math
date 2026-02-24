// gp-1978-complete-exams-feedback-correct-min-5-chars.test.js
// feedback_correct must be at least 5 characters (catches trivially short responses).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    const v = q.feedback_correct;
    if (!v) continue;
    if (v.trim().length >= 5) pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+' feedback_correct too short: "'+v+'"'); }
  }
}
console.log('gp-1978-feedback-correct-min-5: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' feedback_correct strings >= 5 chars');
