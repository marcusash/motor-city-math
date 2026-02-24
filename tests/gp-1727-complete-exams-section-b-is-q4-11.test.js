// gp-1727-complete-exams-section-b-questions-4to11.test.js
// Section B must contain questions 4-11 (8 questions).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const sections = data.questions.slice(3,11).map(q => q.section);
  const ok = sections.every(s => s === 'B');
  if (ok) pass++;
  else { fail++; failures.push(data.exam_id + ' Q4-11 sections: ' + sections.join(',')); }
}
console.log('gp-1727-section-b-is-q4-11: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q4-11 are all Section B in all complete exams (' + pass + ' exams)');
