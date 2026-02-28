// gp-1663-complete-exams-2-graphs-per-exam.test.js
// Most complete exams have 2 graphs. Lock this.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const graphs = data.questions.filter(q => q.graph).length;
  if (graphs === 2) pass++;
  else { fail++; failures.push(data.exam_id + ': graphs=' + graphs); }
}
console.log('gp-1663-2-graphs-per-exam: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all complete exams have exactly 2 graphs (' + pass + ' checked)');
