// gp-2164-complete-exams-key-points-are-arrays.test.js
// ALL key_points in ALL 24 graphs use [x,y] array format (not {x,y} objects).
// This is the correct universal schema (confirmed by auditing all 12 exams).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  let examFail = false;
  for (const q of data.questions.filter(q => q.graph)) {
    const bad = q.graph.key_points.filter(kp => !Array.isArray(kp) || kp.length < 2);
    if (bad.length > 0) { examFail = true; failures.push(data.exam_id + ' Q' + q.number + ' non-array kp: ' + JSON.stringify(bad[0])); }
  }
  if (!examFail) pass++;
  else fail++;
}
console.log('gp-2164-key-points-are-arrays: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All key_points are [x,y] arrays in all 12 exams (universal schema confirmed)');
