// gp-1976-complete-exams-per-step-min-length-5.test.js
// All solution steps must be at least 5 characters (catches blank/trivial steps).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const step of (q.solution_steps||[])) {
      if (typeof step === 'string' && step.trim().length >= 5) pass++;
      else { fail++; failures.push(data.exam_id+':'+q.id+' short step="'+step+'"'); }
    }
  }
}
console.log('gp-1976-steps-min-length: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' solution steps have at least 5 characters');
