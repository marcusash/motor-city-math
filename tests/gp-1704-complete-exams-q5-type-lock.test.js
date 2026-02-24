// gp-1704-complete-exams-q5-type-lock.test.js
// Q5 type snapshot per exam. Most: quadratic, RP6: exponential.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const SNAPSHOT = {
  'retake-practice-1':'quadratic','retake-practice-2':'quadratic','retake-practice-3':'quadratic',
  'retake-practice-4':'quadratic','retake-practice-5':'quadratic','retake-practice-6':'exponential',
  'retake-practice-7':'quadratic','retake-practice-8':'quadratic','retake-practice-9':'quadratic',
  'retake-practice-10':'quadratic','retake-practice-11':'quadratic','retake-practice-12':'quadratic',
};
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const examId = file.replace('.json', '');
  const actual = data.questions[4].type;
  if (actual === SNAPSHOT[examId]) pass++;
  else { fail++; failures.push(examId + ' Q5: expected ' + SNAPSHOT[examId] + ' got ' + actual); }
}
console.log('gp-1704-q5-type-snapshot: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q5 type snapshot locked (' + pass + ' exams)');
