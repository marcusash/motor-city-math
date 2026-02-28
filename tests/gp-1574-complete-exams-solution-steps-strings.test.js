// gp-1574-complete-exams-solution-steps-strings.test.js
// All solution_steps must be non-empty strings (no null, empty, or non-string).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (let i = 0; i < (q.solution_steps || []).length; i++) {
      const s = q.solution_steps[i];
      if (typeof s === 'string' && s.trim().length > 0) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':step[' + i + '] =' + JSON.stringify(s)); }
    }
  }
}
console.log('gp-1574-solution-steps-strings: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all solution_steps are non-empty strings (' + pass + ' steps checked)');
