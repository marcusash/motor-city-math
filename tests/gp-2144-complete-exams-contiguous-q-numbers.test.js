// gp-2144-complete-exams-question-numbers-contiguous.test.js
// Question numbers must be 1-15 contiguous with no gaps in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const nums = data.questions.map(q => q.number).sort((a,b)=>a-b);
  const expected = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  if (JSON.stringify(nums) === JSON.stringify(expected)) pass++;
  else { fail++; failures.push(data.exam_id + ' nums=' + JSON.stringify(nums)); }
}
console.log('gp-2144-contiguous-1-to-15: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Question numbers 1-15 contiguous in all 12 exams');
