// gp-1705-complete-exams-q14-standard-lock.test.js
// Q14 standard snapshot per exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const SNAPSHOT = {
  'retake-practice-1':'W3.a','retake-practice-2':'W3.a','retake-practice-3':'W3.a',
  'retake-practice-4':'W3.a','retake-practice-5':'W3.a','retake-practice-6':'W2.b',
  'retake-practice-7':'W2.d','retake-practice-8':'W2.d','retake-practice-9':'W2.d',
  'retake-practice-10':'W2.d','retake-practice-11':'W2.d','retake-practice-12':'W3.a',
};
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const examId = file.replace('.json', '');
  const actual = data.questions[13].standard;
  if (actual === SNAPSHOT[examId]) pass++;
  else { fail++; failures.push(examId + ' Q14: expected ' + SNAPSHOT[examId] + ' got ' + actual); }
}
console.log('gp-1705-q14-standard-snapshot: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q14 standard snapshot locked (' + pass + ' exams)');
