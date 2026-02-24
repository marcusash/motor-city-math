// gp-2066-complete-exams-section-a-count-3.test.js
// Every complete exam must have exactly 3 Section A questions.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const count = data.questions.filter(q => q.section === 'A').length;
  if (count === 3) pass++;
  else { fail++; failures.push(data.exam_id + ' section_A=' + count); }
}
console.log('gp-2066-section-a-count: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 12 exams have exactly 3 Section A questions');
