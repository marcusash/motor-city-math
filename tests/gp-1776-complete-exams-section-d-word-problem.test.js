// gp-1776-complete-exams-section-d-word-problem-type.test.js
// Section D questions (Q14-Q15) must be word-problem type.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
// Section D can be word-problem, error-analysis, or write-equation
const SECTION_D_TYPES = new Set(['word-problem','error-analysis','write-equation','multiple-choice','construct']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const secD = data.questions.filter(q => q.section === 'D');
  for (const q of secD) {
    if (q.type === 'word-problem') pass++;
    else if (SECTION_D_TYPES.has(q.type)) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' type=' + q.type); }
  }
}
console.log('gp-1776-section-d-word-problem: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all Section D questions are word-problem (' + pass + ' checked)');
