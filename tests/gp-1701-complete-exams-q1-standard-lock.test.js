// gp-1701-complete-exams-q1-standard-lock.test.js
// Snapshot Q1 standard per exam. Two schema variants exist.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
// Snapshot from 2026-02-24 data audit
const SNAPSHOT = {
  'retake-practice-1':'W2.b','retake-practice-2':'W2.b','retake-practice-3':'W2.b',
  'retake-practice-4':'W2.b','retake-practice-5':'W2.b','retake-practice-6':'W2.b',
  'retake-practice-7':'W2.b','retake-practice-8':'W2.a','retake-practice-9':'W2.a',
  'retake-practice-10':'W2.a','retake-practice-11':'W2.a','retake-practice-12':'W2.b',
};
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const examId = file.replace('.json', '');
  const actual = data.questions[0].standard;
  if (actual === SNAPSHOT[examId]) pass++;
  else { fail++; failures.push(examId + ' Q1 standard: expected ' + SNAPSHOT[examId] + ' got ' + actual); }
}
console.log('gp-1701-q1-standard-snapshot: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q1 standard snapshot locked (' + pass + ' exams)');
