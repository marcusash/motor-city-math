// gp-1998-complete-exams-rp1-7-rp12-time-is-60.test.js
// RP1-RP7 and RP12 time_minutes=60 (older schema).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED_60 = ['retake-practice-1.json','retake-practice-2.json','retake-practice-3.json',
  'retake-practice-4.json','retake-practice-5.json','retake-practice-6.json',
  'retake-practice-7.json','retake-practice-12.json'];
let fail = 0;
for (const file of EXPECTED_60) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) { console.log('SKIP:', file, '(incomplete)'); continue; }
  if (data.time_minutes === 60) console.log('OK:', data.exam_id, 'time=60');
  else { console.log('FAIL:', data.exam_id, 'expected 60 got', data.time_minutes); fail++; }
}
if (fail > 0) process.exit(1);
console.log('OK -- RP1-7+RP12 time_minutes=60 confirmed');
