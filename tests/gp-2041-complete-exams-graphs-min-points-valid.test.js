// gp-2041-complete-exams-graphs-min-points-valid.test.js
// All 24 graphs must have min_points = 4 or 5.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID = new Set([4, 5]);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.graph)) {
    const mp = q.graph.min_points;
    if (VALID.has(mp)) pass++;
    else { fail++; failures.push(data.exam_id + ' Q' + q.number + ' min_points=' + mp); }
  }
}
console.log('gp-2041-min-points: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 24 graphs have min_points 4 or 5');
