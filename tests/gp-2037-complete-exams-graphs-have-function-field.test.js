// gp-2037-complete-exams-graphs-have-function-field.test.js
// All 24 graphs (q.graph) must have a non-empty 'function' field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.graph)) {
    const g = q.graph;
    if (typeof g.function === 'string' && g.function.length > 0) pass++;
    else { fail++; failures.push(data.exam_id + ' Q' + q.number + ' function=' + g.function); }
  }
}
console.log('gp-2037-graphs-function-field: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 24 graphs have non-empty function field');
