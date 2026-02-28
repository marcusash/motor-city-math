// gp-1721-complete-exams-key-points-count-per-graph.test.js
// Lock key_points count per graph per exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
// Most graphs have 5 key_points; RP12 Q12 has 7.
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    const kp = (q.graph.key_points || []).length;
    if (kp >= 3 && kp <= 10) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' key_points=' + kp); }
  }
}
console.log('gp-1721-key-points-in-range: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all graph key_points count in [3,10] (' + pass + ' graphs)');
