// gp-2135-complete-exams-no-question-has-graph-outside-c.test.js
// Only Section C questions (Q12/Q13) should have graphs. Others must not.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const outOfC = data.questions.filter(q => q.section !== 'C' && q.graph);
  if (outOfC.length === 0) pass++;
  else { fail++; failures.push(data.exam_id + ' graph outside C: Q' + outOfC.map(q=>q.number).join(',')); }
}
console.log('gp-2135-no-graph-outside-section-c: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- No graph questions outside Section C in all 12 exams');
