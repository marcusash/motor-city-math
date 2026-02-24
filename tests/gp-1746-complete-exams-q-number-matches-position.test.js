// gp-1746-complete-exams-q-number-matches-position.test.js
// q.number must match position+1 (1-indexed).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  data.questions.forEach((q, i) => {
    if (q.number === i + 1) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' number=' + q.number + ' expected=' + (i+1)); }
  });
}
console.log('gp-1746-q-number-matches-position: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all question numbers match array position (' + pass + ' checked)');
