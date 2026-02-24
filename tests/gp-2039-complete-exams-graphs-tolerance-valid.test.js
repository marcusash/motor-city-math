// gp-2039-complete-exams-graphs-tolerance-valid.test.js
// All 24 graphs must have tolerance field = 0.25 or 0.3.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID = new Set([0.25, 0.3]);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const g of (data.graphs || [])) {
    if (VALID.has(g.tolerance)) pass++;
    else { fail++; failures.push(data.exam_id + ' graph ' + g.canvas_id + ' tolerance=' + g.tolerance); }
  }
}
console.log('gp-2039-graphs-tolerance: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 24 graphs have tolerance 0.25 or 0.3');
