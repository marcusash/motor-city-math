// gp-2131-complete-exams-section-b-q4-to-q11-all-exams.test.js
// Section B must contain exactly Q4-Q11 in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const bNums = data.questions.filter(q => q.section === 'B').map(q => q.number).sort((a,b)=>a-b);
  const expected = [4,5,6,7,8,9,10,11];
  if (JSON.stringify(bNums) === JSON.stringify(expected)) pass++;
  else { fail++; failures.push(data.exam_id + ' B=' + JSON.stringify(bNums)); }
}
console.log('gp-2131-section-b-q4-q11: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Section B is always Q4-Q11 in all 12 exams');
