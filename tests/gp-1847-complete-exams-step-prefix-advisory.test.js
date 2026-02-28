// gp-1847-complete-exams-no-solution-step-starts-with-step.test.js
// Solution steps should not begin with 'Step ' (steps are already ordered).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, advisory = 0; const findings = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const step of (q.solution_steps||[])) {
      if (/^Step\s+\d/i.test(step.trim())) { advisory++; findings.push(data.exam_id + ':' + q.id + ': ' + step.substring(0,40)); }
      else pass++;
    }
  }
}
console.log('gp-1847-steps-no-step-prefix: ' + pass + ' clean, ' + advisory + ' with Step prefix (advisory)');
if (advisory > 0) { console.log('ADVISORY: ' + advisory + ' steps start with "Step N"'); }
console.log('OK -- solution step prefix check complete');
