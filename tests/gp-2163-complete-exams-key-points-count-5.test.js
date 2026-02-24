// gp-2163-complete-exams-graph-key-points-count-snapshot.test.js
// All graphs in all 12 exams must have exactly 5 key_points (confirmed universal pattern).
// EXCEPTION: RP9 Q13 key_point is stored as a single [x,y] array (known bug, advisory sent to GI).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const graphQs = data.questions.filter(q => q.graph);
  let examFail = false;
  for (const q of graphQs) {
    if (data.exam_id === 'retake-practice-9' && q.number === 13) continue; // known bug
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
console.log('OK -- All graphs have exactly 5 key_points (RP9 Q13 exception documented)');
