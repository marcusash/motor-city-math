// gp-1702-complete-exams-q2-standard-lock.test.js
// Q2 standard is W2.b across all complete exams (consistent).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q = data.questions[1];
  if (q.standard === 'W2.b') pass++;
  else { fail++; failures.push(data.exam_id + ' Q2 standard=' + q.standard); }
}
console.log('gp-1702-q2-standard-W2b: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all Q2 standard=W2.b (' + pass + ' exams)');
