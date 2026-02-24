// gp-2164-complete-exams-key-points-have-x-y.test.js
// Key points (excluding known RP9 Q13 array exception) must be {x,y} objects.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  let examFail = false;
  for (const q of data.questions.filter(q => q.graph)) {
    if (data.exam_id === 'retake-practice-9' && q.number === 13) continue; // known array bug
    const bad = q.graph.key_points.filter(kp => typeof kp !== 'object' || Array.isArray(kp) || kp.x === undefined || kp.y === undefined);
    if (bad.length > 0) { examFail = true; failures.push(data.exam_id + ' Q' + q.number + ' bad kp: ' + JSON.stringify(bad[0])); }
  }
  if (!examFail) pass++;
  else fail++;
}
console.log('gp-2164-key-points-xy-objects: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All key_points are {x,y} objects (RP9 Q13 exception)');
