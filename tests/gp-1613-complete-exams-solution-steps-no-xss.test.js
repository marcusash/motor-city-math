// gp-1613-complete-exams-solution-steps-no-xss.test.js
// Solution steps must not contain raw script tags.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const XSS_RE = /<script/i;
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const step of (q.solution_steps || [])) {
      if (!XSS_RE.test(step)) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ' step has <script>'); }
    }
  }
}
console.log('gp-1613-steps-no-xss: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no solution_steps contain <script> tags (' + pass + ' steps checked)');
