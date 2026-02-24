// gp-1724-complete-exams-section-a-questions-1to3.test.js
// Section A must contain questions 1, 2, 3 (first 3).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const first3Sections = data.questions.slice(0,3).map(q => q.section);
  const ok = first3Sections.every(s => s === 'A');
  if (ok) pass++;
  else { fail++; failures.push(data.exam_id + ' Q1-3 sections: ' + first3Sections.join(',')); }
}
console.log('gp-1724-section-a-is-q1-3: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q1-3 are all Section A in all complete exams (' + pass + ' exams)');
