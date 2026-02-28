// gp-1591-all-complete-exams-q1-standard.test.js
// Q1 (index 0) standard must be W2.a or W3.a in all complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID = new Set(['W2.a','W3.a','W2.b','W2.c','W3.b','W3.c']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q = data.questions[0];
  if (q.standard && q.standard.startsWith('W')) pass++;
  else { fail++; failures.push(data.exam_id + ': Q1 standard=' + q.standard); }
}
console.log('gp-1591-q1-standard-format: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q1 standard starts with W in all ' + pass + ' complete exams');
