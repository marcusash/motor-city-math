// gp-1811-complete-exams-q12-q13-have-graph.test.js
// Q12 and Q13 must always have a graph object.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (q.number < 12 || q.number > 13) continue;
    if (q.graph && typeof q.graph === 'object') pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' missing graph object'); }
  }
}
console.log('gp-1811-q12-q13-have-graph: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all Q12/Q13 have graph objects (' + pass + ' questions)');
