// gp-2069-complete-exams-section-pattern-aaabbbbbbbbccdd.test.js
// Question sections in every exam must follow pattern: AAABBBBBBBBCCDD.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const EXPECTED_PATTERN = 'AAABBBBBBBBCCDD';
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const sorted = [...data.questions].sort((a,b)=>a.number-b.number);
  const pattern = sorted.map(q => q.section).join('');
  if (pattern === EXPECTED_PATTERN) pass++;
  else { fail++; failures.push(data.exam_id + ' pattern=' + pattern); }
}
console.log('gp-2069-section-pattern: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 12 exams have section pattern AAABBBBBBBBCCDD');
