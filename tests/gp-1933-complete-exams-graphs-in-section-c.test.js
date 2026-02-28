// gp-1933-complete-exams-graph-questions-always-section-c.test.js
// All graph questions (Q12 and Q13) must be in Section C across all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (q.section === 'C') pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+' graph question in section '+q.section); }
  }
}
console.log('gp-1933-graphs-in-section-c: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all '+pass+' graph questions are in Section C');
