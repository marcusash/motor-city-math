// gp-1801-complete-exams-graph-x-range-format.test.js
// Graph x_range must be [min, max] array with min < max.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, advisory = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    const xr = q.graph.x_range;
    if (!xr) { advisory++; continue; }
    if (Array.isArray(xr) && xr.length === 2 && typeof xr[0]==='number' && typeof xr[1]==='number' && xr[0] < xr[1]) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' x_range=' + JSON.stringify(xr)); }
  }
}
console.log('gp-1801-graph-x-range: ' + pass + ' pass, ' + advisory + ' advisory, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all graph x_range are valid [min, max] pairs (' + pass + ' graphs)');
