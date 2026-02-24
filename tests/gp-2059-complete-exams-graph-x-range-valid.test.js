// gp-2059-complete-exams-graph-x-range-has-two-elements.test.js
// All 12 graphs with x_range must have exactly 2 elements: [min, max].

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.graph && Array.isArray(q.graph.x_range))) {
    const xr = q.graph.x_range;
    if (xr.length === 2 && typeof xr[0] === 'number' && typeof xr[1] === 'number' && xr[0] < xr[1]) pass++;
    else { fail++; failures.push(data.exam_id + ' Q' + q.number + ' x_range=' + JSON.stringify(xr)); }
  }
}
console.log('gp-2059-x-range-valid: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 12 x_range fields have valid [min, max] pairs');
