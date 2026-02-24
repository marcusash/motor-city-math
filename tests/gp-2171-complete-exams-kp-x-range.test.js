// gp-2171-complete-exams-key-point-x-range.test.js
// Key point x coordinates must be within reasonable bounds (-20, 20) in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  let examFail = false;
  for (const q of data.questions.filter(q => q.graph)) {
    const outRange = q.graph.key_points.filter(kp => Array.isArray(kp) && (kp[0] < -20 || kp[0] > 20));
    if (outRange.length > 0) { examFail = true; failures.push(data.exam_id + ' Q' + q.number + ' kp x out of range: ' + JSON.stringify(outRange[0])); }
  }
  if (!examFail) pass++;
  else fail++;
}
console.log('gp-2171-kp-x-range: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All key_point x coordinates in [-20, 20] range');
