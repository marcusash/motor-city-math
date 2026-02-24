// gp-1773-complete-exams-solution-steps-min-length.test.js
// Every solution step must be at least 10 chars long (content quality guard).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const step of (q.solution_steps||[])) {
      if (step.length >= 10) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ' step: "' + step + '"'); }
    }
  }
}
console.log('gp-1773-steps-min-length: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all solution steps >= 10 chars (' + pass + ' steps)');
