// gp-1473-all-exams-q12-is-graph.test.js
// Q12 (index 11) must be 'graph' in all 11 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q = data.questions[11];
  if (q && q.type === 'graph') pass++;
  else { fail++; failures.push(data.exam_id + ': Q12 type=' + (q && q.type)); }
}
console.log('gp-1473-q12-is-graph: ' + pass + '/11 pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q12 is graph in all 11 exams');
