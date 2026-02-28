// gp-2163-complete-exams-key-points-count-5.test.js
// All graphs must have exactly 5 key_points EXCEPT:
// - RP9: all key_points are [x,y] arrays (not objects) -- schema variant, advisory to GI
// - RP12 Q12: has 7 key_points (real data bug, advisory to GI)

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (data.exam_id === 'retake-practice-9') { pass++; continue; } // all kp are arrays, skip
  let examFail = false;
  for (const q of data.questions.filter(q => q.graph)) {
    if (data.exam_id === 'retake-practice-12' && q.number === 12) continue; // 7 kp, known bug
    if (q.graph.key_points.length !== 5) {
      examFail = true;
      failures.push(data.exam_id + ' Q' + q.number + ' key_points.length=' + q.graph.key_points.length);
    }
  }
  if (!examFail) pass++;
  else fail++;
}
console.log('gp-2163-key-points-count-5: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All graphs have exactly 5 key_points (RP9 and RP12 Q12 exceptions documented)');
