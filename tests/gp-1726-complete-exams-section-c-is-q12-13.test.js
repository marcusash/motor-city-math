// gp-1726-complete-exams-section-c-questions-12to13.test.js
// Section C must contain questions 12 and 13.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const sections = data.questions.slice(11,13).map(q => q.section);
  const ok = sections.every(s => s === 'C');
  if (ok) pass++;
  else { fail++; failures.push(data.exam_id + ' Q12-13 sections: ' + sections.join(',')); }
}
console.log('gp-1726-section-c-is-q12-13: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q12-13 are all Section C in all complete exams (' + pass + ' exams)');
