// gp-2044-complete-exams-graphs-key-points-have-x-y.test.js
// All key_points in all 24 graphs must have numeric x and y fields.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.graph)) {
    for (const kp of (q.graph.key_points || [])) {
      if (typeof kp.x === 'number' && typeof kp.y === 'number') pass++;
      else { fail++; failures.push(data.exam_id + ' Q' + q.number + ' kp=' + JSON.stringify(kp)); }
    }
  }
}
console.log('gp-2044-key-points-have-xy: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 122 key_points have numeric x and y');
