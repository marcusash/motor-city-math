// gp-2133-complete-exams-q12-q13-always-graph.test.js
// Q12 and Q13 must have a graph in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q12 = data.questions.find(q => q.number === 12);
  const q13 = data.questions.find(q => q.number === 13);
  if (q12 && q13 && q12.graph && q13.graph) pass++;
  else { fail++; failures.push(data.exam_id + ' Q12.graph=' + !!(q12||{}).graph + ' Q13.graph=' + !!(q13||{}).graph); }
}
console.log('gp-2133-q12-q13-have-graph: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q12 and Q13 always have graph in all 12 exams');
