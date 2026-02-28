// gp-2186-complete-exams-time-minutes-snapshot.test.js
// Snapshot lock on time_minutes field. OLDER exams (RP1-7, RP12) = 60. NEWER (RP8-11) = 50.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {
  'retake-practice-1': 60, 'retake-practice-2': 60, 'retake-practice-3': 60,
  'retake-practice-4': 60, 'retake-practice-5': 60, 'retake-practice-6': 60,
  'retake-practice-7': 60, 'retake-practice-8': 50, 'retake-practice-9': 50,
  'retake-practice-10': 50, 'retake-practice-11': 50, 'retake-practice-12': 60
};
let pass = 0, fail = 0; const failures = [];
for (const [exam_id, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, exam_id + '.json'), 'utf8'));
  if (data.time_minutes === expected) pass++;
  else { fail++; failures.push(exam_id + ': expected ' + expected + ' got ' + data.time_minutes); }
}
console.log('gp-2186-time-minutes-snapshot: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All exams time_minutes snapshot locked (OLDER=60, NEWER=50)');
