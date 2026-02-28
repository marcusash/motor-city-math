// gp-1802-complete-exams-graph-y-range-format.test.js
// Graph y_range must be [min, max] array with min < max.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, advisory = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    const yr = q.graph.y_range;
    if (!yr) { advisory++; continue; }
    if (Array.isArray(yr) && yr.length === 2 && typeof yr[0]==='number' && typeof yr[1]==='number' && yr[0] < yr[1]) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' y_range=' + JSON.stringify(yr)); }
  }
}
console.log('gp-1802-graph-y-range: ' + pass + ' pass, ' + advisory + ' advisory, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all graph y_range are valid [min, max] pairs (' + pass + ' graphs)');
