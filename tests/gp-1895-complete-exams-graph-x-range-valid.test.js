// gp-1895-complete-exams-graph-x-range-valid.test.js
// Graph x_range must be [min, max] with min < max.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    const r = q.graph.x_range;
    if (!r) continue; // x_range optional (12/24 graphs have it)
    if (Array.isArray(r) && r.length === 2 && typeof r[0]==='number' && typeof r[1]==='number' && r[0] < r[1]) pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+' x_range='+JSON.stringify(r)); }
  }
}
console.log('gp-1895-graph-x-range-valid: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all graph x_ranges are valid [min, max] pairs (' + pass + ' graphs)');
