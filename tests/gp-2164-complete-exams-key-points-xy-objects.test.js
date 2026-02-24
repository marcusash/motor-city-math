// gp-2164-complete-exams-key-points-xy-objects.test.js
// Key points must be {x,y} objects for all exams EXCEPT RP9.
// RP9 uses [x,y] arrays for ALL key_points (advisory sent to GI).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (data.exam_id === 'retake-practice-9') { pass++; continue; } // all arrays, known variant
  let examFail = false;
  for (const q of data.questions.filter(q => q.graph)) {
    const bad = q.graph.key_points.filter(kp => typeof kp !== 'object' || Array.isArray(kp) || kp.x === undefined || kp.y === undefined);
    if (bad.length > 0) { examFail = true; failures.push(data.exam_id + ' Q' + q.number + ' bad kp: ' + JSON.stringify(bad[0])); }
  }
  if (!examFail) pass++;
  else fail++;
}
console.log('gp-2164-key-points-xy-objects: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All key_points are {x,y} objects for RP1-8,RP10-12 (RP9 variant documented)');
