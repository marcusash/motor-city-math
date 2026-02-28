// gp-1951-complete-exams-tolerance-values-locked.test.js
// All 24 graphs have tolerance = 0.25 or 0.3 (the only valid values).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID = new Set([0.25, 0.3]);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    const t = q.graph.tolerance;
    if (VALID.has(t)) pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+' tolerance='+t); }
  }
}
console.log('gp-1951-tolerance-locked: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' graphs have tolerance 0.25 or 0.3');
