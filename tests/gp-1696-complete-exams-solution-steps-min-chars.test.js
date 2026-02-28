// gp-1696-complete-exams-solution-steps-min-words.test.js
// Each solution step must have at least 5 characters (not trivially empty).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const step of (q.solution_steps || [])) {
      const text = typeof step === 'string' ? step : (step.text || step.step || '');
      if (text.length >= 5) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ' step too short: ' + JSON.stringify(text)); }
    }
  }
}
console.log('gp-1696-solution-steps-min-chars: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all solution steps >=5 chars (' + pass + ' steps checked)');
