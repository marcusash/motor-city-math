// gp-1824-complete-exams-per-exam-time-minutes-lock.test.js
// RP1-7+RP12 = 60min, RP8-11 = 50min. Lock all.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {
  'retake-practice-1.json':60,'retake-practice-2.json':60,'retake-practice-3.json':60,
  'retake-practice-4.json':60,'retake-practice-5.json':60,'retake-practice-6.json':60,
  'retake-practice-7.json':60,'retake-practice-8.json':50,'retake-practice-9.json':50,
  'retake-practice-10.json':50,'retake-practice-11.json':50,'retake-practice-12.json':60
};
let pass = 0, fail = 0; const failures = [];
for (const [file, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.time_minutes === expected) pass++;
  else { fail++; failures.push(file.replace('.json','') + ' expected=' + expected + ' got=' + data.time_minutes); }
}
console.log('gp-1824-time-minutes: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all exam time_minutes locked (60min: RP1-7+RP12, 50min: RP8-11)');
