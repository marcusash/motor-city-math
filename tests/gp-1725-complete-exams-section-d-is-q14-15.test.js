// gp-1725-complete-exams-section-d-questions-14to15.test.js
// Section D must contain questions 14 and 15 (last 2).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const last2Sections = data.questions.slice(13,15).map(q => q.section);
  const ok = last2Sections.every(s => s === 'D');
  if (ok) pass++;
  else { fail++; failures.push(data.exam_id + ' Q14-15 sections: ' + last2Sections.join(',')); }
}
console.log('gp-1725-section-d-is-q14-15: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q14-15 are all Section D in all complete exams (' + pass + ' exams)');
