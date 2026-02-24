// gp-1997-complete-exams-rp8-rp11-time-is-50.test.js
// RP8, RP9, RP10, RP11 time_minutes=50 (newer schema).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED_50 = ['retake-practice-8.json','retake-practice-9.json','retake-practice-10.json','retake-practice-11.json'];
let fail = 0;
for (const file of EXPECTED_50) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.time_minutes === 50) console.log('OK:', data.exam_id, 'time=50');
  else { console.log('FAIL:', data.exam_id, 'expected 50 got', data.time_minutes); fail++; }
}
if (fail > 0) process.exit(1);
console.log('OK -- RP8/RP9/RP10/RP11 time_minutes=50 confirmed');
