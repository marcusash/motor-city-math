// gp-2162-complete-exams-graph-has-key-points.test.js
// All graphs must have a key_points array in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const graphQs = data.questions.filter(q => q.graph);
  const noKp = graphQs.filter(q => !Array.isArray(q.graph.key_points) || q.graph.key_points.length === 0);
  if (noKp.length === 0) pass++;
  else { fail++; failures.push(data.exam_id + ' Q' + noKp.map(q=>q.number).join(',') + ' missing key_points'); }
}
console.log('gp-2162-graph-has-key-points: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All graphs have non-empty key_points in all 12 exams');
