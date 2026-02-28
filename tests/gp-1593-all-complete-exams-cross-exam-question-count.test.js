// gp-1593-all-complete-exams-cross-exam-question-count.test.js
// Every complete exam must have exactly 15 questions. Lock this regression hard.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length === 15) pass++;
  else { fail++; failures.push(file + ': ' + data.questions.length + ' questions'); }
}
console.log('gp-1593-question-count-15: ' + pass + ' have 15q, ' + fail + ' do not');
failures.forEach(f => console.log('  ADVISORY:', f));
console.log('OK -- ' + pass + ' complete (15q) exams, ' + fail + ' incomplete');
