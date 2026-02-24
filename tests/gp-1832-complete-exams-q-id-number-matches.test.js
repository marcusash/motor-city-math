// gp-1832-complete-exams-q-id-number-matches-position.test.js
// Every question ID must end with '-q{N}' where N matches question.number.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    const m = q.id.match(/-q(\d+)$/);
    if (m && parseInt(m[1]) === q.number) pass++;
    else { fail++; failures.push(file + ':' + q.id + ' number=' + q.number); }
  }
}
console.log('gp-1832-q-id-number: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all question IDs have correct -q{N} suffix matching position (' + pass + ' questions)');
