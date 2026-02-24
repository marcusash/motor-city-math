// gp-1878-complete-exams-graph-key-points-are-arrays.test.js
// All graph.key_points must be arrays (not null/undefined/string).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    const kp = q.graph.key_points;
    if (Array.isArray(kp)) pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+' key_points='+typeof kp); }
  }
}
console.log('gp-1878-key-points-arrays: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all graph.key_points are arrays (' + pass + ' graphs)');
