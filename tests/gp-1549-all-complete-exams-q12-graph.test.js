// gp-1549-all-complete-exams-q12-graph.test.js
// Q12 must be 'graph' type in all complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue; // skip incomplete
  const q12 = data.questions[11];
  if (q12 && q12.type === 'graph') pass++;
  else { fail++; failures.push(data.exam_id + ': Q12 type=' + (q12 && q12.type)); }
}
console.log('gp-1549-all-complete-q12-graph: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q12=graph in all ' + pass + ' complete exams');
