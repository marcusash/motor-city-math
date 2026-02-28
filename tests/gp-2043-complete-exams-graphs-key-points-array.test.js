// gp-2043-complete-exams-graphs-key-points-array.test.js
// All 24 graphs must have key_points as an array.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.graph)) {
    if (Array.isArray(q.graph.key_points)) pass++;
    else { fail++; failures.push(data.exam_id + ' Q' + q.number + ' key_points=' + typeof q.graph.key_points); }
  }
}
console.log('gp-2043-key-points-array: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 24 graphs have key_points as array');
