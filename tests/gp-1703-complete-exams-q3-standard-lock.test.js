// gp-1703-complete-exams-q3-standard-lock.test.js
// Q3 standard snapshot per exam. Older schema: W2.b, newer: W3.a.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const SNAPSHOT = {
  'retake-practice-1':'W2.b','retake-practice-2':'W2.b','retake-practice-3':'W2.b',
  'retake-practice-4':'W2.b','retake-practice-5':'W2.b','retake-practice-6':'W2.b',
  'retake-practice-7':'W2.b','retake-practice-8':'W3.a','retake-practice-9':'W3.a',
  'retake-practice-10':'W3.a','retake-practice-11':'W3.a','retake-practice-12':'W2.b',
};
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const examId = file.replace('.json', '');
  const actual = data.questions[2].standard;
  if (actual === SNAPSHOT[examId]) pass++;
  else { fail++; failures.push(examId + ' Q3: expected ' + SNAPSHOT[examId] + ' got ' + actual); }
}
console.log('gp-1703-q3-standard-snapshot: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q3 standard snapshot locked (' + pass + ' exams)');
