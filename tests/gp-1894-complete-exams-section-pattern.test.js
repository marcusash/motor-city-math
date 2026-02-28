// gp-1894-complete-exams-aaabbbbbbbbbccdd-section-pattern.test.js
// Every exam must follow AAABBBBBBBBBCCDD section assignment for Q1-15.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const PATTERN = 'AAABBBBBBBBCCDD'; // 3A+8B+2C+2D=15
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const sorted = data.questions.slice().sort((a,b)=>a.number-b.number);
  const actual = sorted.map(q=>q.section).join('');
  if (actual === PATTERN) pass++;
  else { fail++; failures.push(data.exam_id + ' got=' + actual); }
}
console.log('gp-1894-section-pattern: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- AAABBBBBBBBBCCDD pattern confirmed for all ' + pass + ' complete exams');
